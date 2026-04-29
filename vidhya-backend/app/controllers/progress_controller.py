"""
app/controllers/progress_controller.py  -  Progress Tracker
"""
from datetime import datetime, date
from fastapi import HTTPException
from app.models.progress import Progress, ChapterProgress, AddChapterSchema, UpdateChapterSchema, UpdateStreakSchema
from app.models.user import User
from app.utils.response_helper import success_response


async def _get_or_create(user_id: str) -> Progress:
    prog = await Progress.find_one({"owner_id": user_id})
    if not prog:
        prog = Progress(owner_id=user_id)
        await prog.insert()
    return prog


async def get_progress(current_user: User):
    prog = await _get_or_create(str(current_user.id))
    return success_response("Progress fetched.", prog.model_dump())


async def add_chapter(body: AddChapterSchema, current_user: User):
    prog = await _get_or_create(str(current_user.id))
    if any(c.chapter_name == body.chapter_name and c.subject == body.subject for c in prog.chapters):
        raise HTTPException(status_code=409, detail="This chapter is already tracked.")
    prog.chapters.append(ChapterProgress(chapter_name=body.chapter_name, subject=body.subject))
    await prog.save()
    return success_response("Chapter added.", prog.model_dump(), status=201)


async def update_chapter(chapter_id: str, body: UpdateChapterSchema, current_user: User):
    prog = await _get_or_create(str(current_user.id))
    chapter = next((c for c in prog.chapters if c.id == chapter_id), None)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found.")
    chapter.completion_pct = body.completion_pct
    chapter.last_studied   = datetime.utcnow()
    await prog.save()
    return success_response("Chapter updated.", prog.model_dump())


async def update_streak(body: UpdateStreakSchema, current_user: User):
    prog  = await _get_or_create(str(current_user.id))
    today = date.today()

    last = prog.last_study_date.date() if prog.last_study_date else None
    if last != today:
        yesterday = date.fromordinal(today.toordinal() - 1)
        prog.current_streak = (prog.current_streak + 1) if last == yesterday else 1
        prog.longest_streak = max(prog.longest_streak, prog.current_streak)
        prog.last_study_date = datetime.utcnow()

    prog.total_study_minutes  += body.study_minutes or 0
    prog.flashcards_reviewed  += body.flashcards_reviewed or 0
    if body.mock_test_completed:
        prog.mock_tests_attempted += 1

    # Streak milestone
    for m in prog.milestones:
        if m.title == "7-Day Study Streak" and not m.achieved and prog.current_streak >= 7:
            m.achieved = True; m.achieved_at = datetime.utcnow()

    await prog.save()
    return success_response("Streak updated.", prog.model_dump())


async def get_leaderboard():
    top = await Progress.find().sort("-current_streak").limit(20).to_list()
    return success_response("Leaderboard fetched.", [p.model_dump() for p in top])
