((Drupal, drupalSettings, once) => {
  'use strict';

  Drupal.behaviors.soloSubTheme = {
    attach: (context, settings) => {

      once('api-fetch-test', '.node-info-item', context).forEach((element) => {
        element.addEventListener('click', (e) => {
          e.preventDefault();

          const nodeId = element.dataset.nodeId;
          if (!nodeId) {
            console.warn('No se encontró el data-node-id en el elemento.');
            return;
          }

          fetch(`/node/${nodeId}?_format=json`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json'
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener el nodo: ' + response.status);
            }
            return response.json();
          })
          .then(data => {
            const title = data.title?.[0]?.value || 'Sin título';
            const sobre = data.field_sobre_el_programa?.[0]?.value || '';
            const descripcion = data.field_descripcion?.[0]?.value || '';
            const desde = data.field_hora_desde?.[0]?.value || '';
            const hasta = data.field_horas_hasta?.[0]?.value || '';

            // Si ya existe el modal, elimínalo para evitar duplicados
            const existing = document.getElementById('simple-modal');
            if (existing) existing.remove();

            // Crear el modal
            const modal = document.createElement('div');
            modal.id = 'simple-modal';
            modal.style.position = 'fixed';
            modal.style.top = 0;
            modal.style.left = 0;
            modal.style.right = 0;
            modal.style.bottom = 0;
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = 9999;

            modal.innerHTML = `
              <div style="background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px; position: relative;">
                <button id="close-modal" style="position: absolute; top: 1rem; right: 1rem; font-size: 18px;">✖</button>
                <h2>${title}</h2>
                <p>${descripcion}</p>
                <p><strong>Sobre el programa:</strong> ${sobre}</p>
                <p><strong>Horario:</strong> ${desde} – ${hasta}</p>
              </div>
            `;

            document.body.appendChild(modal);

            // Cerrar el modal
            document.getElementById('close-modal').addEventListener('click', () => {
              modal.remove();
            });

            modal.addEventListener('click', (event) => {
              if (event.target === modal) {
                modal.remove();
              }
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });
        });
      });
    }
  };

})(Drupal, drupalSettings, once);
