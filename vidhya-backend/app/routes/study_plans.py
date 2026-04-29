"""app/routes/study_plans.py  -  Study Plan Routes"""
from fastapi import APIRouter, Depends
from app.models.study_plan import StudyPlanCreateSchema, StudyPlanUpdateSchema
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
import app.controllers.studyplan_controller as ctrl

router = APIRouter()

@router.get("/")
async def get_plans(current_user: User = Depends(get_current_user)):
    return await ctrl.get_study_plans(current_user)

@router.post("/")
async def create_plan(body: StudyPlanCreateSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.create_study_plan(body, current_user)

@router.get("/{plan_id}")
async def get_plan(plan_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.get_study_plan_by_id(plan_id, current_user)

@router.put("/{plan_id}")
async def update_plan(plan_id: str, body: StudyPlanUpdateSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.update_study_plan(plan_id, body, current_user)

@router.delete("/{plan_id}")
async def delete_plan(plan_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.delete_study_plan(plan_id, current_user)

@router.patch("/{plan_id}/sessions/{session_id}/complete")
async def toggle_session(plan_id: str, session_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.toggle_session(plan_id, session_id, current_user)
