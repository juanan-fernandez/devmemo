# Dashboard fase 3

Esta es la fase 3/3 de la implementación ui de la página dashboard.

- Se especifica la sección Main de la página dashboard
- Usa el screenshot indicado en la sección referencias para crear el diseño lo más parecido posible.
- Usa los datos de @lib/mockdata.ts. Posteriormente usaremos una bd real.

## Requerimientos

- El encabezado del dashboard deben ser 4 cards cada una con el texto de un color:
   - Una card indicando el número total de items registrados.
   - otra card el número de colecciones.
   - otra card el número de items favoritos.
   - otra card para las colecciones favoritas
- En la siguiente línea deben aparecer las últimas 3 colecciones añadidas también en cards.
   - cada card debe llevar el recuadro en el color del item predominante, y llevar el icono de ese tipo de item.
- En la siguiente línea todos los items que hayamos marcado como pinned para fijar en el dashboard
- Los items s fijados deben poderse mostrar en forma de card o de lista con unos iconos en la parte derecha (tal y como aparecen en la screenshot)

## References

- @context/stich/design-home.md
- @context/stich/screens/mainScreen.png
- @context/project-overview.md
- @lib/mockdata.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-2-spec.md
