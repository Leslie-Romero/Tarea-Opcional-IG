# Tarea Opcional IG
## Autores
Leslie Liu Romero Martín
## Introducción
Esta tarea se trata de una ampliación en la práctica de la semana 11 en la que decidí utlizar la librería Ammo.js para crear un juego en el que se puedan derribar ciertos ladrillos de un muro para revelar un mensaje oculto, esto se consigue manteniendo ciertos ladrillos del muro fijos mientras que el resto se pueden mover con los proyectiles.

La idea surgió en clase al descubrir la librería Ammo.js a través de los ejemplos de los profesores, me pareció que la acción de derribar ladrillos con las esferas que hacen de munición era algo relajante y que podía resultar entretenido como juego añadiendole otros elementos.

## Funcionalidades existentes
En cuanto a lo que ya se encontraba implementado en la práctica: la dinámica de derribar los ladrillos, por supuesto, ya que era parte de la idea inicial; la textura en movimiento de un gradiente de colores en el suelo para añadir ambientación ya estaba presente; la posibilidad de añadir música de fondo a través del botón en la parte superior derecha y el sonido de los proyectiles también existía previamente; el botón con la bombilla que ilumina el mensaje para facilitar el trabajo de derribar los ladrillos; el botón de reseteo (anteriormente llamado 'restart') para poder reconstruir el muro las veces que fuesen necesarias y el selector de mensajes que se encuentra en la parte superior izquierda. 

Todo esto ya se encontraba implementado y me he dedicado a mejorarlo y añadir nuevas funcionalidades en esta tarea práctica opcional.

## Funcionalidades añadidas
Con respecto a las funcionalidades añadidas, la más notable serían los modos de juego, ahora existen dos modos de juego: por niveles (Levels) y relajado (Zen). El primer modo sigue un orden progresivo de menor a mayor dificultad, incorpora una barra de progreso que se vuelve verde cuando se considera que el nivel está completado (se han derribado todos los ladrillos que no son fijos y se ha desvelado el mensaje) y cuenta con un límite de bolas (munición) permitido para cada nivel. Además, a medida que se van completando niveles, se avanza automáticamente, sin embargo, si no se consigue completar el nivel con el número de bolas establecido, se debe reiniciar el propio nivel hasta conseguirlo. de lo contrario, se muestra un mensaje de alerta de que te has quedado sin munición. En cualquier momento se puede pasar al modo Zen, que también muestra la barra de progreso, pero en el que se puede utilizar toda la munición que se desee, haciendo alusión a su nombre, es una modalidad relajada y sin presión, simplemente por el placer de jugar. 

Otro de los cambios importantes que se realizaron con respecto a la versión anterior es la mecánica de juego. Anteriormente, el disparo de las bolas se realizaba haciendo click en cualquiera de los botones del ratón, ahora, para evitar conflicto y para poder manejar la interfaz de usuario sin disparar accidentalmente, así como los controles de la cámara, decidí cambiar el disparo para que se utilice la barra espaciadora del teclado; la posición del ratón se utiliza para apuntar y el espacio para lanzar el proyectil. 

Otros añadidos pueden ser: el botón del "ojo" arriba a la derecha, este botón se puede utilizar para visualizar el resultado final donde todos los ladrillos se han derribado y solo queda el mensaje, esto es puramente visual ya que no se puede utilizar para saltar niveles, sirve un propósito similar al de la "bombilla" pero mientras la bombilla te facilita el juego y permite avanzar, este botón se debe utilizar solo si no se quiere jugar más este nivel y se quiere ver el resultado o se va a resetear el nivel de todas formas y quiere aprovechar para ver el resultado si lo hubiese conseguido, ya que **no guarda ningún tipo de progreso**. 

En conclusión, con todos estos nuevos avances, el juego, que antes era funcional pero no un producto del todo acabado, ahora tiene más jugabilidad, funcionalidades útiles como la barra de progreso y nuevas limitaciones como el número máximo de bolas, conservando la esencia inicial, que era poder relajarse observando las físicas de los ladrillos siendo derribados, con el modo Zen.
