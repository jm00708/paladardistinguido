"""
Carga publicaciones de prueba en la red social del tenant activo.
Crea 5 comensales demo con perfiles sensoriales distintos y 8 posts
representativos de los arquetipos de paladar.
"""
from django.core.management.base import BaseCommand
from django_tenants.utils import schema_context


DEMO_DINERS = [
    {
        'email': 'ana.torres@paladar.demo',
        'sensory': {'body': 0.85, 'acidity': 0.45, 'tannins': 0.88, 'sweetness': 0.15, 'salinity': 0.30, 'minerality': 0.40},
    },
    {
        'email': 'miguel.luna@paladar.demo',
        'sensory': {'body': 0.30, 'acidity': 0.88, 'tannins': 0.22, 'sweetness': 0.15, 'salinity': 0.45, 'minerality': 0.55},
    },
    {
        'email': 'sofia.garza@paladar.demo',
        'sensory': {'body': 0.40, 'acidity': 0.75, 'tannins': 0.28, 'sweetness': 0.10, 'salinity': 0.50, 'minerality': 0.92},
    },
    {
        'email': 'carlos.reyes@paladar.demo',
        'sensory': {'body': 0.38, 'acidity': 0.65, 'tannins': 0.25, 'sweetness': 0.18, 'salinity': 0.88, 'minerality': 0.68},
    },
    {
        'email': 'valentina.mora@paladar.demo',
        'sensory': {'body': 0.80, 'acidity': 0.38, 'tannins': 0.52, 'sweetness': 0.48, 'salinity': 0.22, 'minerality': 0.28},
    },
]

DEMO_POSTS = [
    {
        'author': 'ana.torres@paladar.demo',
        'wine_id': 1,
        'wine_name': 'Château Léoville-Barton 2016',
        'winery': 'Château Léoville-Barton',
        'dish_name': 'Lomo alto de res con tuétano',
        'note': 'Los taninos maduros del Léoville se fundieron con la grasa del tuétano de forma magistral. Una de las experiencias más memorables que he tenido en una mesa.',
    },
    {
        'author': 'miguel.luna@paladar.demo',
        'wine_id': 7,
        'wine_name': 'Domaine Leflaive Puligny-Montrachet 2019',
        'winery': 'Domaine Leflaive',
        'dish_name': 'Vieiras salteadas con mantequilla de algas',
        'note': 'Acidez perfecta para limpiar el paladar entre bocado y bocado. La mineralidad del Puligny potencia el sabor marino de las vieiras. Descubrimiento del año.',
    },
    {
        'author': 'sofia.garza@paladar.demo',
        'wine_id': 12,
        'wine_name': 'Didier Dagueneau Pouilly-Fumé 2020',
        'winery': 'Didier Dagueneau',
        'dish_name': 'Ceviche clásico de huachinango',
        'note': 'La mineralidad del Dagueneau con el ceviche es una combinación que no esperaba. Notas a pedernal y cítricos que se mezclan con el ácido del limón. Extraordinario.',
    },
    {
        'author': 'carlos.reyes@paladar.demo',
        'wine_id': 9,
        'wine_name': 'Txakoli de Getaria Ameztoi 2022',
        'winery': 'Ameztoi',
        'dish_name': 'Pulpo al ajillo con papas ahumadas',
        'note': 'Con el pulpo ya es un clásico pero en Paladar lo llevaron al siguiente nivel. Levísima efervescencia natural del Txakoli, salinidad que va directo al ADN del marisqueo.',
    },
    {
        'author': 'valentina.mora@paladar.demo',
        'wine_id': 4,
        'wine_name': 'Châteauneuf-du-Pape Château Rayas 2017',
        'winery': 'Château Rayas',
        'dish_name': 'Magret de pato con mole negro',
        'note': 'El Rayas tiene esa textura voluptuosa perfecta para el pato. Con el mole negro fue una declaración de amor entre el Mediterráneo y Oaxaca en un solo sorbo.',
    },
    {
        'author': 'ana.torres@paladar.demo',
        'wine_id': 2,
        'wine_name': 'Vega Sicilia Único 2012',
        'winery': 'Vega Sicilia',
        'dish_name': 'Costilla de res al mezcal con chiles secos',
        'note': 'Único, literalmente. Los taninos sedosos del Tempranillo viejo con la complejidad ahumada de la costilla al mezcal. Esto es lo que vine a buscar.',
    },
    {
        'author': 'miguel.luna@paladar.demo',
        'wine_id': 14,
        'wine_name': 'Etna Rosso Cornelissen Contadino 2021',
        'winery': 'Cornelissen',
        'dish_name': 'Robalo a la sal con aceite de oliva del lugar',
        'note': 'Un vino volcánico para un pez de roca. La acidez vibrante y las notas minerales del Etna fueron el mejor acompañante para la delicadeza del robalo. Descubrimiento revelador.',
    },
    {
        'author': 'sofia.garza@paladar.demo',
        'wine_id': 17,
        'wine_name': 'Keller G-Max Riesling 2018',
        'winery': 'Weingut Keller',
        'dish_name': 'Langosta dividida con mantequilla de trufa',
        'note': 'La nobleza del Riesling G-Max frente a la extravagancia de la langosta con trufa. Acidez que corta la mantequilla, dulzura que abraza la langosta. Un equilibrio perfecto.',
    },
]

DEMO_REACTIONS = [
    ('miguel.luna@paladar.demo',   0, 'descubrimiento'),
    ('sofia.garza@paladar.demo',   0, 'maridaje'),
    ('carlos.reyes@paladar.demo',  0, 'favorito'),
    ('valentina.mora@paladar.demo', 0, 'maridaje'),
    ('ana.torres@paladar.demo',    1, 'descubrimiento'),
    ('sofia.garza@paladar.demo',   1, 'favorito'),
    ('carlos.reyes@paladar.demo',  1, 'maridaje'),
    ('ana.torres@paladar.demo',    2, 'descubrimiento'),
    ('miguel.luna@paladar.demo',   2, 'maridaje'),
    ('valentina.mora@paladar.demo', 2, 'descubrimiento'),
    ('valentina.mora@paladar.demo', 3, 'maridaje'),
    ('miguel.luna@paladar.demo',   3, 'descubrimiento'),
    ('ana.torres@paladar.demo',    4, 'favorito'),
    ('carlos.reyes@paladar.demo',  4, 'maridaje'),
    ('sofia.garza@paladar.demo',   4, 'descubrimiento'),
    ('valentina.mora@paladar.demo', 5, 'maridaje'),
    ('carlos.reyes@paladar.demo',  5, 'favorito'),
    ('miguel.luna@paladar.demo',   6, 'descubrimiento'),
    ('valentina.mora@paladar.demo', 6, 'maridaje'),
    ('ana.torres@paladar.demo',    7, 'descubrimiento'),
    ('carlos.reyes@paladar.demo',  7, 'maridaje'),
]

DEMO_COMMENTS = [
    ('miguel.luna@paladar.demo',   0, 'Totalmente de acuerdo, los taninos del Léoville son extraordinarios con carnes grasas.'),
    ('sofia.garza@paladar.demo',   0, 'Lo probé el mes pasado aquí mismo y fue una revelación. ¡Gracias por compartirlo!'),
    ('valentina.mora@paladar.demo', 1, 'El Puligny-Montrachet con mariscos es un clásico por algo. Perfecta elección.'),
    ('ana.torres@paladar.demo',    2, '¡Exactamente lo que describes! El Dagueneau tiene esa mineralidad que va muy bien con los cítricos del ceviche.'),
    ('valentina.mora@paladar.demo', 2, 'Jamás había pensado en un Sancerre o Pouilly con ceviche, pero tiene todo el sentido.'),
    ('miguel.luna@paladar.demo',   3, 'El Txakoli con pulpo es una combinación que aprendí en el País Vasco. Qué bueno que lo rescaten aquí.'),
    ('sofia.garza@paladar.demo',   4, 'El Rayas con mole negro suena a aventura gastronómica. ¿El sommelier lo recomendó o fue elección propia?'),
    ('valentina.mora@paladar.demo', 4, 'Lo recomendó el sistema y fue un acierto total. El Grenache del Rayas y los chiles del mole son hermanos de alma.'),
    ('carlos.reyes@paladar.demo',  5, 'Vega Sicilia Único es siempre una declaración. Con la costilla al mezcal debe ser una experiencia fuera de lo común.'),
    ('miguel.luna@paladar.demo',   6, 'El Etna Rosso es mi gran descubrimiento del año también. Esa acidez volcánica es única.'),
    ('carlos.reyes@paladar.demo',  7, 'El G-Max de Keller con langosta suena celestial. ¿A cuánto está la botella en la carta?'),
]


class Command(BaseCommand):
    help = 'Carga publicaciones de prueba en la red social del tenant especificado.'

    def add_arguments(self, parser):
        parser.add_argument('--schema', default='noma_mx', help='Tenant schema name')
        parser.add_argument('--clear', action='store_true', help='Borra posts demo existentes antes de crear')

    def handle(self, *args, **options):
        from django_tenants.utils import schema_context
        schema = options['schema']

        with schema_context(schema):
            self._run(options)

    def _run(self, options):
        from apps.diners.models import Diner, SensoryProfile
        from apps.social.models import Comment, PostReaction, WinePost

        if options['clear']:
            demo_emails = [d['email'] for d in DEMO_DINERS]
            demo_diners = Diner.objects.filter(email__in=demo_emails)
            WinePost.objects.filter(diner__in=demo_diners).delete()
            self.stdout.write('Posts demo eliminados.')

        # Crear / actualizar comensales demo
        diners_by_email = {}
        for data in DEMO_DINERS:
            diner, created = Diner.objects.get_or_create(
                email=data['email'],
                defaults={'is_guest': False},
            )
            if created:
                diner.is_guest = False
                diner.save(update_fields=['is_guest'])

            s = data['sensory']
            SensoryProfile.objects.update_or_create(
                diner=diner,
                defaults={
                    'body_preference': s['body'],
                    'acidity_preference': s['acidity'],
                    'tannins_preference': s['tannins'],
                    'sweetness_preference': s['sweetness'],
                    'salinity_preference': s['salinity'],
                    'minerality_preference': s['minerality'],
                },
            )
            diners_by_email[data['email']] = diner
            action = 'creado' if created else 'actualizado'
            self.stdout.write(f'  Comensal {action}: {data["email"]}')

        # Crear posts
        posts = []
        for pd in DEMO_POSTS:
            author = diners_by_email[pd['author']]
            post, created = WinePost.objects.get_or_create(
                diner=author,
                wine_id=pd['wine_id'],
                defaults={
                    'wine_name': pd['wine_name'],
                    'winery': pd['winery'],
                    'dish_name': pd['dish_name'],
                    'note': pd['note'],
                    'is_public': True,
                },
            )
            posts.append(post)
            if created:
                self.stdout.write(f'  Post creado: {pd["wine_name"]}')

        # Crear reacciones
        reaction_count = 0
        for email, post_idx, reaction_type in DEMO_REACTIONS:
            if post_idx >= len(posts):
                continue
            diner = diners_by_email.get(email)
            if not diner:
                continue
            post = posts[post_idx]
            if post.diner_id == diner.id:
                continue  # no reaccionar al propio post
            _, created = PostReaction.objects.get_or_create(
                post=post,
                diner=diner,
                defaults={'reaction_type': reaction_type},
            )
            if created:
                reaction_count += 1

        # Crear comentarios
        comment_count = 0
        for email, post_idx, text in DEMO_COMMENTS:
            if post_idx >= len(posts):
                continue
            diner = diners_by_email.get(email)
            if not diner:
                continue
            post = posts[post_idx]
            exists = Comment.objects.filter(post=post, diner=diner, text=text).exists()
            if not exists:
                Comment.objects.create(post=post, diner=diner, text=text)
                comment_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'\n✓ Red social inicializada: {len(posts)} posts, '
            f'{reaction_count} reacciones, {comment_count} comentarios.'
        ))
