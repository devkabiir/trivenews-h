"""
Add index to document.num_annotations

Revision ID: 43bf98abd7b8
Revises: 06452b49bb74
Create Date: 2017-10-30 16:06:06.576607
"""

from __future__ import unicode_literals

from alembic import op


revision = '43bf98abd7b8'
down_revision = '06452b49bb74'


def upgrade():
    op.create_index('ix__document_num_annotations', 'document', ['num_annotations'], unique=False)
    op.create_index('ix__document_created', 'document', ['created'], unique=False)


def downgrade():
    op.drop_index('ix__document_num_annotations', 'num_annotations')
    op.drop_index('ix__document_created', 'created')

