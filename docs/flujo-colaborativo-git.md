# Flujo colaborativo de versionamiento con Git y GitHub

## Informacion de la actividad
**Proyecto:** SwimTrack  
**Asignatura:** Mantenimiento de software  
**Actividad:** Actividad 4 - Utilizando sistemas de control de versiones  
**Integrantes:** Josberth Anibal Patiño y Nicolas Saenz Bello

## Proposito
Este documento describe el flujo colaborativo utilizado por el equipo para
registrar aportes dentro del repositorio SwimTrack mediante Git y GitHub.
Las funcionalidades asociadas a las historias de usuario ya forman parte de la
version base del proyecto; por ello, la actividad evidencia la documentacion
y el uso del control de versiones en un entorno colaborativo.

## Flujo de trabajo aplicado
1. El repositorio principal se encuentra alojado publicamente en GitHub.
2. Cada integrante clono el repositorio en su equipo local.
3. Cada integrante creo una rama independiente para registrar su aporte.
4. Los archivos fueron agregados mediante git add.
5. Los cambios fueron registrados mediante git commit.
6. Las ramas fueron enviadas al repositorio remoto mediante git push.
7. Los aportes fueron integrados a main mediante Pull Requests.
8. El historial final permite verificar la participacion del equipo.

## Comandos utilizados
| Comando | Aplicacion dentro de la actividad |
|---|---|
| git clone | Obtener una copia local del repositorio |
| git status | Consultar archivos nuevos o modificados |
| git branch | Crear y visualizar ramas de trabajo |
| git add | Agregar archivos al area de preparacion |
| git commit | Registrar los aportes realizados |
| git remote -v | Consultar la conexion con GitHub |
| git push | Publicar las ramas en el repositorio remoto |
| git log | Consultar el historial de commits |
| .gitignore | Excluir archivos locales o sensibles |

## Aportes registrados
| Integrante | Rama utilizada | Aporte |
|---|---|---|
| Nicolas Saenz Bello | docs/historias-usuario-nicolas | Historias de usuario |
| Josberth Anibal Patiño | docs/flujo-git-josberth | Flujo colaborativo |

## Resultado esperado
Al finalizar, la rama main debe contener los documentos creados por ambos
integrantes y un historial que permita verificar la aplicacion de Git y GitHub.