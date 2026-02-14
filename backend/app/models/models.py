# ============================================================
# ORM Models — User, Organization, Request, Document
# ============================================================

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Float, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, relationship
import enum


class Base(DeclarativeBase):
    pass


class UserRole(str, enum.Enum):
    admin = "admin"
    employee = "employee"
    viewer = "viewer"


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    inn = Column(String(12), unique=True, nullable=False)
    address = Column(Text)
    phone = Column(String(20))
    email = Column(String(255))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    users = relationship("User", back_populates="organization")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.employee, nullable=False)
    is_active = Column(Boolean, default=True)
    totp_secret = Column(String(32), nullable=True)  # 2FA
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_active = Column(DateTime(timezone=True), nullable=True)

    organization = relationship("Organization", back_populates="users")


class Request(Base):
    __tablename__ = "requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    original_text = Column(Text, nullable=False)
    masked_text = Column(Text)
    response_text = Column(Text)
    risk_level = Column(String(10), default="low")
    status = Column(String(20), default="draft")  # draft | processing | completed
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime(timezone=True), nullable=True)


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(10))  # pdf, docx
    file_size = Column(Float)
    storage_path = Column(Text)
    analysis_result = Column(Text)  # JSON строка
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
