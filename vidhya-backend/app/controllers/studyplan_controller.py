"""
app/controllers/studyplan_controller.py  -  Study Plan CRUD
"""
from datetime import datetime
from fastapi import HTTPException
from app.models.study_plan import StudyPlan, StudyPlanCreateSchema, StudyPlanUpdateSchema, Session
from app.models.user import User
from app.utils.response_helper import success_response


async def get_study_plans(current_user: User):
    plans = await StudyPlan.find({"owner_id": str(current_user.id)}).to_list()
    return success_response("Study plans fetched.", [p.model_dump() for p in plans])


async def create_study_plan(body: StudyPlanCreateSchema, current_user: User):
    sessions = [Session(**s.model_dump()) for s in (body.sessions or [])]
    plan = StudyPlan(owner_id=str(current_user.id), week_label=body.week_label, sessions=sessions)
    await plan.insert()
    return success_response("Study plan created.", plan.model_dump(), status=201)


async def get_study_plan_by_id(plan_id: str, current_user: User):
    plan = await StudyPlan.find_one({"_id": plan_id, "owner_id": str(current_user.id)})
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found.")
    return success_response("Study plan fetched.", plan.model_dump())


async def update_study_plan(plan_id: str, body: StudyPlanUpdateSchema, current_user: User):
    plan = await StudyPlan.find_one({"_id": plan_id, "owner_id": str(current_user.id)})
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found.")
    if body.week_label is not None: plan.week_label = body.week_label
    if body.sessions   is not None: plan.sessions   = [Session(**s.model_dump()) for s in body.sessions]
    if body.is_active  is not None: plan.is_active  = body.is_active
    plan.recalculate_adherence()
    plan.updated_at = datetime.utcnow()
    await plan.save()
    return success_response("Study plan updated.", plan.model_dump())


async def delete_study_plan(plan_id: str, current_user: User):
    plan = await StudyPlan.find_one({"_id": plan_id, "owner_id": str(current_user.id)})
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found.")
    await plan.delete()
    return success_response("Study plan deleted.", {"id": plan_id})


async def toggle_session(plan_id: str, session_id: str, current_user: User):
    plan = await StudyPlan.find_one({"_id": plan_id, "owner_id": str(current_user.id)})
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found.")
    session = next((s for s in plan.sessions if s.id == session_id), None)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    session.is_completed = not session.is_completed
    plan.recalculate_adherence()
    await plan.save()
    status_label = "completed" if session.is_completed else "incomplete"
    return success_response(f"Session marked as {status_label}.", plan.model_dump())
