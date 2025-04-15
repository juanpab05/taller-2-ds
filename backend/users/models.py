from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser, User

class User(AbstractUser):
    phone_number = models.PositiveBigIntegerField(
        unique=False,blank=False,null=False,
        validators=[
            RegexValidator(
                regex=r'^(3|6)\d{9}$',
                message=('No es un número de teléfono válido'),
                code='invalid_phonenumber'
            )
        ],
        verbose_name='Número teléfono'
    )
    dni = models.PositiveBigIntegerField(
        unique=True, blank=False, null=False,
        validators=[
            RegexValidator(
                regex=r'^\d{7,10}$',
                message=('No es un número de documento válido'),
                code='invalid_dni'
            )
        ],
        verbose_name='Cédula ciudadania')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name','last_name','email','dni','phone_number']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['id']
