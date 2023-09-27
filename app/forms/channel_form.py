from flask_wtf import FlaskForm
from wtforms import BooleanField, StringField
from wtforms.validators import DataRequired


class ChannelForm(FlaskForm):
  name = StringField('Name', validators=[DataRequired()])
  private = BooleanField('Private')
