# Aplicación web de Candidatos Kanban - IA Claude Sonnet 3.7 (Cursor)

## Contexto

Estamos trabajando en una aplicación de gestión de procesos de selección que incluye una interfaz estilo **kanban**.

Vamos a crear dos nuevos endpoints que nos permitirán manipular la lista de candidatos. Utiliza el fichero README.md para tener más contexto del proyecto, este fichero se encuentra en la raíz del proyecto.

Actúa como un backend develop experto en DDD.

Los endpoints se generarán dentro de la carpeta backend.

Antes de generar código pregúntame si deseo continuar

---

## Objetivo

Los endpoints a crear serián los siguientes:

- `GET /positions/:id/candidates`
- `PUT /candidates/:id/stage`


No generes nada todavía, quiero seguir añadiendo contexto.

---

## Prompt 1
Si, vamos a crear el primer endpoint:

### **GET /positions/:id/candidates**

**Objetivo:**  
Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

Nombre completo del candidato (de la tabla candidate).
current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score


### **Requisitos Técnicos:**

- Buscar todas las aplicaciones (`application`) relacionadas al `position_id`.
- Incluir los datos de la tabla `candidate` uniendo por la relación entre **application** y **candidate**.
- Calcular el `average_score` de forma dinámica a partir de la tabla **interview**:
    - **Sólo** considerar las entrevistas que tengan un `score` válido (evitar nulls).
- La respuesta debe ser **un array de objetos JSON** con estos tres campos.

### **Consideraciones:**

- Candidatos sin entrevistas todavía → `average_score` puede ser `null` o `0`, pero debe estar presente en la respuesta.
- Eliminar duplicados si por algún error de modelado existieran múltiples aplicaciones duplicadas.
- Manejar el caso de posición inexistente (`position_id` no encontrado): retornar `404 Not Found` claramente.

---

## Prompt 2
Si, ahora vamos a crear el segundo endpoint(PUT), aquí tienes más información:

### **PUT /candidates/:id/stage**

Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.

### **Requisitos Técnicos:**

- Validar que el candidato (`candidate_id`) existe antes de intentar actualizar.
- Asegurar que la nueva `current_interview_step` pertenece a un conjunto de etapas válidas si existe un catálogo de fases (opcional: si no existe, simplemente guardar el texto).
- Retornar un `200 OK` con el objeto actualizado o un mensaje de éxito.

---

## Prompt 3: Readme

- Actualiza el fichero README.md con los últimos cambios aplicados.