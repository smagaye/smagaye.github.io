/*This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/
function languageApp(langue) {
	if ( langue === "fr" ) {
		this.$title = "Podomètre";
		this.$settings = "Paramètres";
		this.$info = "Informations";
		this.$hide = "Cacher le menu";
		this.$show = "Montrer le menu";
		this.$distance = "DISTANCE";
		this.$meanSpeed = "VITESSE<br/>MOYENNE";
		this.$calories = "CALORIES<br/>BRÛLÉES";
		this.$reinit = "Réinitialisation";
		this.$pause = "Mettre en pause";
		this.$play = "Compter les pas";
		this.$gpsEnabled = "Option de géolocalisation";
		this.$isGPS = "Géolocalisation en cours de fonctionnement...";
		this.$errorGPS1 = "Géolocalisation non autorisée";
		this.$errorGPS2 = "Géolocalisation non disponible";
		this.$errorGPS3 = "En attente de géolocalisation...";
		this.$errorGPS4 = "Géolocalisation non disponible";		
		this.$stepSize = "Taille de votre pas";
		this.$weight = "Poids";
		this.$save = "Sauver";
		this.$default = "Par défaut";
		this.$changesSaved = "Changement sauvegardés";
		this.$defaultLoaded = "Paramètres par défaut chargés";
		this.$done = "Valider";
		this.$help = "Ce podomètre (version 1) compte vos pas lorsque vous marchez. Il vous indique la distance parcourue, votre vitesse moyenne et instantannée ainsi que les calories brûlées.<br/>"+
		"Le calcul repose sur un seuillage adaptatif des données mesurées pas les accéléromètres de votre ordiphone. Pour limiter les erreurs de mesures, un filtre de Kalman corrige les accélérations mesurées.<br/>"+
		"Pour fonctionner l'écran de verrouillage ne doit pas se lancer. Lorsque cette application fonctionne, l'écran de verrouillage est donc automatiquement bloqué. Vous pourrez donc mettre votre téléphone dans votre poche et marcher librement. Après votre randonnée, il ne vous restera plus qu'à lire vos statistiques de marche." + 
		"<h2>Podomètre</h2>" + 
		"<dl>" +
			"<dt>Indicateur de vitesse</dt>" +
				"<dd>Vous indique graphiquement votre vitesse instantannées en km/h calculées à partir des 2 dernières secondes.</dd>" +
			"<dt>Nombre de pas</dt>" + 
				"<dd>Somme de tous les pas que vous avez fait pendant votre randonnées</dd>" +
			"<dt>Distance</dt>" + 
				"<dd>Distance totale parcourue en kilomètres</dd>" +
			"<dt>Vitesse moyenne</dt>" + 
				"<dd>Vitesse moyenne pendant votre marche</dd>" +
			"<dt>Calories brûlées</dt>" + 
				"<dd>Énergie dépensée pendant votre randonnées en calorie</dd>" +
		"</dl>"+
		"<h2>Paramètres</h2>" + 
		"<dl>" +
			"<dt>Taille de votre pas</dt>" +
				"<dd>Vous devez préciser la taille de votre pas. Nous conseillons de compter vos pas sur une grande distance. Le rapport entre la distance et le nombre de pas vous donnera la taille de votre pas</dd>" +
			"<dt>Poids</dt>" + 
				"<dd>Précisez votre poids pour le calcul des calories brûlées</dd>" +
		"</dl>";
	} else if ( langue === "es" ) {
		this.$title = "Podómetro";
		this.$settings = "Configuración";
		this.$info = "Información";
		this.$hide = "Esconder el menú ";
		this.$show = "Mostrar el menú";
		this.$distance = "DISTANCIA";
		this.$meanSpeed = "VELOCIDAD<br/>PROMEDIO ";
		this.$calories = "CALORÍAS<br/>QUEMADAS ";
		this.$reinit = "Reajustar ";
		this.$pause = "Pausa";
		this.$play = "Contar pasos";
		this.$gpsEnabled = "Opción de geolocalización ";
		this.$isGPS = "Geolocalización corriendo...";
		this.$errorGPS1 = "Geolocalización no autorizado";
		this.$errorGPS2 = "Geolocalización no disponible";
		this.$errorGPS3 = "A la espera de geolocalización...";
		this.$errorGPS4 = "Geolocalización no disponible ";		
		this.$stepSize = "Tamaño del paso";
		this.$weight = "Peso";
		this.$save = "Guardar";
		this.$default = "Por defecto";
		this.$changesSaved = "Cambios guardados";
		this.$defaultLoaded = "Predeterminados cargados";
		this.$done = "Validar";
		this.$help = "Ce podomètre (version 1) compte vos pas lorsque vous marchez. Il vous indique la distance parcourue, votre vitesse moyenne et instantannée ainsi que les calories brûlées.<br/>"+
		"Le calcul repose sur un seuillage adaptatif des données mesurées pas les accéléromètres de votre ordiphone. Pour limiter les erreurs de mesures, un filtre de Kalman corrige les accélérations mesurées.<br/>"+
		"Pour fonctionner l'écran de verrouillage ne doit pas se lancer. Lorsque cette application fonctionne, l'écran de verrouillage est donc automatiquement bloqué. Vous pourrez donc mettre votre téléphone dans votre poche et marcher librement. Après votre randonnée, il ne vous restera plus qu'à lire vos statistiques de marche." + 
		"<h2>Podomètre</h2>" + 
		"<dl>" +
			"<dt>Indicateur de vitesse</dt>" +
				"<dd>Vous indique graphiquement votre vitesse instantannées en km/h calculées à partir des 2 dernières secondes.</dd>" +
			"<dt>Nombre de pas</dt>" + 
				"<dd>Somme de tous les pas que vous avez fait pendant votre randonnées</dd>" +
			"<dt>Distance</dt>" + 
				"<dd>Distance totale parcourue en kilomètres</dd>" +
			"<dt>Vitesse moyenne</dt>" + 
				"<dd>Vitesse moyenne pendant votre marche</dd>" +
			"<dt>Calories brûlées</dt>" + 
				"<dd>Énergie dépensée pendant votre randonnées en calorie</dd>" +
		"</dl>"+
		"<h2>Paramètres</h2>" + 
		"<dl>" +
			"<dt>Taille de votre pas</dt>" +
				"<dd>Vous devez préciser la taille de votre pas. Nous conseillons de compter vos pas sur une grande distance. Le rapport entre la distance et le nombre de pas vous donnera la taille de votre pas</dd>" +
			"<dt>Poids</dt>" + 
				"<dd>Précisez votre poids pour le calcul des calories brûlées</dd>" +
		"</dl>";
	} else {
		this.$title = "Pedometer";
		this.$settings = "Settings";
		this.$info = "Information";
		this.$hide = "Hide sidebar";
		this.$show = "Show sidebar";
		this.$distance = "DISTANCE";
		this.$meanSpeed = "MEAN<br/>SPEED";
		this.$calories = "CALORIES<br/>BURNED";
		this.$reinit = "Reinitialization";
		this.$pause = "Pause";
		this.$play = "Count steps";
		this.$gpsEnabled = "GPS Option";
		this.$isGPS = "GPS running...";
		this.$errorGPS1 = "No permission for geolocation";
		this.$errorGPS2 = "Geolocation is unavailable";
		this.$errorGPS3 = "Awaiting geolocation...";
		this.$errorGPS4 = "Geolocation is unavailable";
		this.$stepSize = "Step Size";
		this.$weight = "Weight";
		this.$save = "Save";
		this.$default = "Default";
		this.$changesSaved = "Changes saved";
		this.$defaultLoaded = "Default settings loaded";
		this.$done = "Done";
		this.$help = "This pedometer (version 1) counts your steps when you are walking. It indicates you the distance traveled, the mean and instantaneous speed and calories burned.<br/>" +
		"The calculation is based on an adaptive thresholding of accelerometer data measured by your smartphone. To minimize measurement errors, a Kalman filter can correct the measured accelerations.<br/> " +
		"The lock screen does not start so that the web-app works. When this application is running, the lock screen is automatically locked. So you can put your smartphone in your pocket and walk freely. After your hike, it will do just read your statistics." +
		"<h2>Pedometer</h2>" +
		"<dl>" +
			"<dt>Speedometer</dt>" +
				"<dd>It graphically shows you your instantaneous speed (km/h) calculated from the last 2 seconds.</dd>" +
			"<dt>Number of Step</dt>" +
				"<dd>Sum of all steps that you did during your hiking.</dd>" +
			"<dt>Distance</dt>" +
				"<dd>Total distance walked in kilometers</dd>" +
			"<dt>Mean Speed</dt>" +
				"<dd>Mean speed during your hike</dd>" +
			"<dt>Calories Burned</dt>" +
				"<dd>Power burned during your hikes in calorie</dd>" +
			"</dl>" +
		"<h2>Settings</h2>" +
			"<dl>" +
				"<dt>Step Size</dt>" +
					"<dd>You must specify the step size. We recommend counting your steps for a long distance. The ratio between distance and  step number will give you the step size.</dd>" +
				"<dt>Weight</dt>" +
					"<dd>Indicate your weight for the calculation of calories burned </dd>" +
			"</dl>" ;
	};
};

// Podomètre
// Paramètres
// Informations
// Cacher le menu
// Montrer le menu
// DISTANCE
// VITESSE MOYENNE
// CALORIES BRÛLÉES
// Réinitialisation
// Option de géolocalisation
// Géolocalisation en cours de fonctionnement...
// Géolocalisation non autorisée
// Géolocalisation non disponible
// En attente de géolocalisation...
// Géolocalisation non disponible		
// Taille de votre pas
// Poids
// Sauver
// Par défaut
// Changement sauvegardés
// Paramètres par défaut chargés
// Valider
// Ce podomètre (version 1) compte vos pas lorsque vous marchez. Il vous indique la distance parcourue, votre vitesse moyenne et instantannée ainsi que les calories brûlées.
// Le calcul repose sur un seuillage adaptatif des données mesurées pas les accéléromètres de votre ordiphone. Pour limiter les erreurs de mesures, un filtre de Kalman corrige les accélérations mesurées.
// Pour fonctionner l'écran de verrouillage ne doit pas se lancer. Lorsque cette application fonctionne, l'écran de verrouillage est donc automatiquement bloqué. Vous pourrez donc mettre votre téléphone dans votre poche et marcher librement. Après votre randonnée, il ne vous restera plus qu'à lire vos statistiques de marche." + 
// Podomètre
// Indicateur de vitesse
// Vous indique graphiquement votre vitesse instantannées en km/h calculées à partir des 2 dernières secondes.
// Nombre de pas
// Somme de tous les pas que vous avez fait pendant votre randonnées
// Distance
// Distance totale parcourue en kilomètres
// Vitesse moyenne
// Vitesse moyenne pendant votre marche
// Calories brûlées
// Énergie dépensée pendant votre randonnées en calorie
// Paramètres
// Taille de votre pas
// Vous devez préciser la taille de votre pas. Nous conseillons de compter vos pas sur une grande distance. Le rapport entre la distance et le nombre de pas vous donnera la taille de votre pas
// Poids
// Précisez votre poids pour le calcul des calories brûlées