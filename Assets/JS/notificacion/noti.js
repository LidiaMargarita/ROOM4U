document.addEventListener("DOMContentLoaded", () => {
    const notificationBell = document.getElementById("notificationBell");
    const notificationsModal = document.getElementById("notificationsModal");
    const notificationCount = document.getElementById("notificationCount");
    const notificationList = document.getElementById("notificationList");

    // Simulando las notificaciones (esto vendría del backend)
    let notifications = [
        "Un propietario te ha asignado como cliente.",
        
    ];

    // Actualizar la campanita
    function updateNotificationBell() {
        const count = notifications.length;
        if (count > 0) {
            notificationCount.textContent = count;
            notificationCount.style.display = "block";
        } else {
            notificationCount.style.display = "none";
        }
    }

    // Mostrar/ocultar notificaciones
    function toggleNotifications() {
        if (notificationsModal.style.display === "block") {
            notificationsModal.style.display = "none";
        } else {
            notificationList.innerHTML = ""; // Limpiar lista
            notifications.forEach((notif) => {
                const li = document.createElement("li");
                li.textContent = notif;
                notificationList.appendChild(li);
            });
            notificationsModal.style.display = "block";
        }
    }

    // Evento al hacer clic en la campanita
    notificationBell.addEventListener("click", () => {
        toggleNotifications();
    });

    // Actualizar la campanita al cargar
    updateNotificationBell();
});