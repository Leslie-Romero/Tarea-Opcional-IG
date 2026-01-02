# Tarea Opcional IG
## Autores
Leslie Liu Romero Martín
## Introducción
Esta tarea se trata de una ampliación en la práctica de la semana 11 en la que decidí utlizar la librería Ammo.js para crear un juego en el que se puedan derribar ciertos ladrillos de un muro para revelar un mensaje oculto, esto se consigue manteniendo ciertos ladrillos del muro fijos mientras que el resto se pueden mover con los proyectiles.

La idea surgió en clase al descubrir la librería Ammo.js a través de los ejemplos, me pareció que la acción de derribar ladrillos con las esferas que hacen de munición era algo relajante y que podía resultar entretenido al añadirle otros elementos.

## Funcionalidades existentes
En cuanto a lo que ya se encontraba implementado en la práctica: la dinámica de derribar los ladrillos, por supuesto, ya que era parte de la idea inicial; el entorno con una textura en movimiento de un gradiente de colores en el suelo para añadir ambientación ya estaba presente; la posibilidad de añadir música de fondo a través del botón en la parte superior derecha también existía previamente; el botón con la bombilla que ilumina el mensaje para facilitar el trabajo de derribar los ladrillos; el botón de reseteo (anteriormente llamado 'restart') para poder reconstruir el muro las veces que fuesen necesarias y el selector de mensajes que se encuentra en la parte superior derecha. 

Todo esto ya se encontraba implementado y me he dedicado a mejorarlo y añadir nuevas funcionalidades en esta tarea práctica.

## Funcionalidades añadidas
Con respecto a las funcionalidades añadidas, la más notable serían los modos de juego, ahora existen dos modos de juego: por niveles (Levels) y relajado (Zen). El primer modo sigue un orden progresivo de menor a mayor dificultad, incorpora una barra de progreso que se vuelve verde cuando se considera que el nivel está completado (se han derribado toods los ladrillos que no son fijos y se ha desvelado el mensaje) y cuenta con un límite de bolas (munición) permitido para cada nivel. Además, a medida que se van completando niveles, se avanza automáticamente, sin embargo, si no se consigue completar el nivel con el número de bolas establecido, se debe reiniciar el propio nivel hasta conseguirlo o simplemente no se permite avanzar. En cualquier momento se puede pasar al modo Zen, que también muestra la barra de progreso para poder tener una idea del progreso, pero se puede utilizar toda la munición que se desee, haciendo alusión a su nombre, es una modalidad relajada y sin presión, simplemente por el placer de jugar. 

Otro de los cambios importantes que se realizaron con respecto a la versión anterior es la mecánica de juego. Anteriormente, el disparo de las bolas se realizaba haciendo click en cualquiera de los botones del ratón, ahora, para evitar conflicto y para poder manejar la interfaz de usuario sin disparar accidentalmente, así como los controles de la cámara, decidí cambiar el disparo para que se utilice la barra espaciadora del teclado; la posición del ratón se utiliza para apuntar y el espacio para lanzar el proyectil. 

Otros añadidos pueden ser:
