from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, BooleanField, IntegerField
from wtforms.validators import DataRequired, Length
from app.routes.aws_helpers import ALLOWED_EXTENSIONS


class ServerForm(FlaskForm):
  name = StringField('Name', validators=[DataRequired(), Length(max=100)])
  image_url = FileField("Image File", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
  private = BooleanField('Private')
