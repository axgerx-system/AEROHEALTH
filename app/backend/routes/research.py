"""Research summary and methodology endpoints."""
from fastapi import APIRouter

from ..schemas import ResearchMethodologyResponse, ResearchSummaryResponse
from ..services.research_service import research_methodology, research_summary

router = APIRouter()


@router.get("/research/summary", response_model=ResearchSummaryResponse)
def get_research_summary() -> ResearchSummaryResponse:
    return ResearchSummaryResponse(**research_summary())


@router.get("/research/methodology", response_model=ResearchMethodologyResponse)
def get_research_methodology() -> ResearchMethodologyResponse:
    return ResearchMethodologyResponse(**research_methodology())
