from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name='WineInventory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('wine_id', models.IntegerField(db_index=True)),
                ('available', models.BooleanField(default=True)),
                ('price_glass', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('price_bottle', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('notes', models.CharField(blank=True, max_length=200)),
                ('last_updated', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'inventario de vino',
                'verbose_name_plural': 'inventario de vinos',
                'ordering': ['wine_id'],
                'app_label': 'inventory',
            },
        ),
    ]
