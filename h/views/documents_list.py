
from pyramid.httpexceptions import HTTPFound
from pyramid.view import view_config, view_defaults

from h import session as h_session
from h.auth.tokens import generate_jwt
from h.util.view import json_view
from h import __version__


@view_defaults(route_name='document.list',
               renderer='h:templates/documents_list/list.html.jinja2')
class DocumentsListController(object):

    def __init__(self, request):
        # form_footer = '<a class="link" href="{href}">{text}</a>'.format(
        #     href=request.route_path('forgot_password'),
        #     text=_('Forgot your password?'))

        self.request = request
        # self.schema = schemas.LoginSchema().bind(request=self.request)

        # show_cancel_button = bool(request.params.get('for_oauth', False))
        # self.form = request.create_form(self.schema,
        #                                 buttons=(_('Log in'),),
        #                                 footer=form_footer,
        #                                 show_cancel_button=show_cancel_button)

        # self.logout_redirect = self.request.route_url('index')

    @view_config(request_method='GET',
                 renderer='h:templates/documents_list/list.html.jinja2')
    def get(self):
        """Render blank templates, vue.js will handle ajax"""
        return {}
