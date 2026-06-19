from django.db import migrations, models
import django.db.models.deletion
import django.core.validators
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True
    dependencies = [
        ('diners', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='WinePost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('diner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                            related_name='posts', to='diners.diner')),
                ('wine_id', models.IntegerField(db_index=True)),
                ('wine_name', models.CharField(max_length=200)),
                ('winery', models.CharField(blank=True, max_length=200)),
                ('dish_name', models.CharField(blank=True, max_length=200)),
                ('note', models.TextField(blank=True, validators=[
                    django.core.validators.MaxLengthValidator(600)
                ])),
                ('photo', models.ImageField(blank=True, null=True, upload_to='social/posts/')),
                ('is_public', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='PostReaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                           related_name='reactions', to='social.winepost')),
                ('diner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                            related_name='reactions', to='diners.diner')),
                ('reaction_type', models.CharField(max_length=20, choices=[
                    ('maridaje', '🍷 Maridaje perfecto'),
                    ('descubrimiento', '✦ Descubrimiento'),
                    ('favorito', '♡ Favorito'),
                ])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={'unique_together': {('post', 'diner')}},
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                           related_name='comments', to='social.winepost')),
                ('diner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                            related_name='comments', to='diners.diner')),
                ('text', models.TextField(max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={'ordering': ['created_at']},
        ),
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                               related_name='following', to='diners.diner')),
                ('following', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                                related_name='followers', to='diners.diner')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={'unique_together': {('follower', 'following')}},
        ),
    ]
