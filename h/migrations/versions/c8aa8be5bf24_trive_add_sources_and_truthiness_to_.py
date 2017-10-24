"""
trive add sources and truthiness to annotations

Revision ID: c8aa8be5bf24
Revises: 9bcc39244e82
Create Date: 2017-10-16 12:20:11.082375
"""

from __future__ import unicode_literals

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql as pg


revision = 'c8aa8be5bf24'
down_revision = '9bcc39244e82'

def upgrade():
    op.add_column('annotation', sa.Column('sources', pg.ARRAY(sa.UnicodeText, zero_indexes=True)))
    op.add_column('annotation', sa.Column('truthiness', sa.Integer()))

def downgrade():
    op.drop_column('annotation', 'sources')
    op.drop_column('annotation', 'truthiness')