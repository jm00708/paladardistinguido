from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Diner, SensoryProfile
from .serializers import DinerSerializer, QuestionnaireSerializer, SensoryProfileSerializer


class GuestSessionView(APIView):
    """Crea una sesión de invitado al escanear el QR."""
    permission_classes = [AllowAny]

    def post(self, request):
        age_verified = request.data.get('age_verified', False)
        if not age_verified:
            return Response(
                {'error': 'Debes confirmar que eres mayor de 18 años.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        diner = Diner.objects.create(is_guest=True, age_verified=True)
        SensoryProfile.objects.create(diner=diner)
        return Response({'diner_id': diner.id}, status=status.HTTP_201_CREATED)


class QuestionnaireView(APIView):
    """Guarda las respuestas del cuestionario inicial."""
    permission_classes = [AllowAny]

    def post(self, request, diner_id):
        try:
            diner = Diner.objects.get(id=diner_id)
            profile = diner.sensory_profile
        except (Diner.DoesNotExist, SensoryProfile.DoesNotExist):
            return Response({'error': 'Comensal no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = QuestionnaireSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        # Mapear experiencia a preferencia de taninos/cuerpo como proxy
        experience_body = {'beginner': 0.3, 'occasional': 0.45, 'enthusiast': 0.65, 'expert': 0.8}

        body = d['body']
        acidity = d['acidity']
        tannins = d['tannins']
        sweetness = d['sweetness']

        exp_boost = experience_body.get(d['experience'], 0.5)
        profile.body_preference = max(body, exp_boost)
        profile.acidity_preference = acidity
        profile.tannins_preference = tannins
        profile.sweetness_preference = sweetness
        # Inferir salinity y minerality desde la afinidad con acidez y sequedad
        profile.salinity_preference = round(min(0.9, 0.2 + acidity * 0.45 + (1 - sweetness) * 0.15), 3)
        profile.minerality_preference = round(min(0.95, 0.25 + acidity * 0.35 + (1 - sweetness) * 0.25), 3)
        profile.save()

        return Response(SensoryProfileSerializer(profile).data)


class RegisterDinerView(APIView):
    """Convierte un invitado en miembro registrado (o crea uno nuevo)."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        guest_diner_id = request.data.get('guest_diner_id')

        if not email:
            return Response({'error': 'El correo es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        # Si ya existe un miembro con ese email lo devolvemos
        existing = Diner.objects.filter(email=email, is_guest=False).first()
        if existing:
            return Response(DinerSerializer(existing).data, status=status.HTTP_200_OK)

        # Convertir invitado existente o crear nuevo
        if guest_diner_id:
            try:
                diner = Diner.objects.get(id=guest_diner_id, is_guest=True)
                diner.email = email
                diner.is_guest = False
                diner.auth_provider = 'email'
                diner.save(update_fields=['email', 'is_guest', 'auth_provider'])
            except Diner.DoesNotExist:
                diner = Diner.objects.create(
                    email=email, is_guest=False, auth_provider='email', age_verified=True,
                )
                SensoryProfile.objects.get_or_create(diner=diner)
        else:
            diner = Diner.objects.create(
                email=email, is_guest=False, auth_provider='email', age_verified=True,
            )
            SensoryProfile.objects.get_or_create(diner=diner)

        return Response(DinerSerializer(diner).data, status=status.HTTP_201_CREATED)


class DinerProfileView(APIView):
    """Perfil sensorial del comensal registrado."""

    def get(self, request):
        try:
            diner = Diner.objects.get(email=request.user.email)
        except Diner.DoesNotExist:
            return Response({'error': 'Perfil no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(DinerSerializer(diner).data)
