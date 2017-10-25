"""
Add index to target_uri

Revision ID: 5eee56322108
Revises: c8aa8be5bf24
Create Date: 2017-10-24 21:30:48.472513
"""

from __future__ import unicode_literals

from alembic import op


revision = '5eee56322108'
down_revision = 'c8aa8be5bf24'
        
def upgrade():
    op.execute('COMMIT')
    op.create_index(op.f('ix__annotation_target_uri'), 'annotation', ['target_uri'],
                    unique=False)


def downgrade():
    op.drop_index(op.f('ix__annotation_target_uri'), 'annotation')