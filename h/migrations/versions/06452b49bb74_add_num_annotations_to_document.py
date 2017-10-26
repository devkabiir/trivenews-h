"""
Add num_annotations to Document

Revision ID: 06452b49bb74
Revises: 5eee56322108
Create Date: 2017-10-26 10:25:31.083120
"""

from __future__ import unicode_literals

from alembic import op
import sqlalchemy as sa


revision = '06452b49bb74'
down_revision = '5eee56322108'

def upgrade():
    op.add_column('document', sa.Column('num_annotations', sa.Integer(), default=0))
    op.add_column('document', sa.Column('avg_score', sa.Integer(), default=0))

def downgrade():
    op.drop_column('document', 'num_annotations')
    op.drop_column('document', 'avg_score')
