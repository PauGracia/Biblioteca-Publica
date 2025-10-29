# 📚 Biblioteca Pública - Sistema de Gestión de Bibliotecas

> ⚠️ **Estado del proyecto**: En desarrollo activo  
> 🎯 **Propósito**: Proyecto educativo y de práctica

## 🚧 Estado Actual

**Biblioteca Pública** se encuentra actualmente en **fase de desarrollo**. Es un proyecto creado fundamentalmente con fines educativos, para la práctica y exploración de tecnologías web modernas.

Aunque funcional, puede contener características en evolución y se recomienda su uso principalmente para entornos de aprendizaje y desarrollo.

## 🌍 Compatibilidad Multiplataforma

El proyecto está diseñado para ser compatible con los principales sistemas operativos:

- ✅ **Linux** (Ubuntu, Debian, Fedora, etc.)
- ✅ **Windows** (10, 11 + WSL recomendado)
- ✅ **macOS** (versiones recientes)

## 🎯 Descripción del Proyecto

**Biblioteca Pública** es una aplicación web desarrollada para la gestión integral de bibliotecas, diseñada tanto para los usuarios que desean explorar y gestionar sus préstamos de libros como para los administradores que necesitan mantener el control del catálogo y las operaciones de la biblioteca.

Este proyecto nace con un propósito fundamentalmente **educativo y de práctica**, creado por mera diversión y con el objetivo de profundizar en el dominio de diversas tecnologías web modernas. No está destinado inicialmente para uso en producción, aunque su arquitectura permite una potencial adaptación para entornos reales.

## 🛠️ Stack Tecnológico

El proyecto utiliza un stack tecnológico completo y moderno:

- **Backend**: Django (Python) con Django REST Framework
- **Frontend**: React con JavaScript moderno
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Estilos**: CSS3 y frameworks de componentes
- **APIs**: Arquitectura RESTful
- **Control de versiones**: Git

## 🌐 Entornos de Despliegue

### Desarrollo Local

La aplicación está configurada para ejecutarse de forma óptima en entornos de desarrollo local, utilizando el servidor integrado de Django y el entorno de desarrollo de React.

### Producción (Adaptable)

Aunque el enfoque principal es el desarrollo, la aplicación puede adaptarse para su despliegue en diversos entornos de producción:

- **Apache** con mod_wsgi
- **Nginx** con Gunicorn
- **Docker** y contenedores
- **Plataformas cloud** (AWS, Google Cloud, Azure, DigitalOcean)
- **Servidores VPS** tradicionales
- **Plataformas PaaS** (Heroku, Railway, PythonAnywhere)

## ⚙️ Características Principales

- 🔍 **Catálogo de libros** con búsqueda y filtros
- 👥 **Gestión de usuarios** y perfiles
- 📚 **Sistema de préstamos** y reservas
- 🏷️ **Categorización** de libros por géneros
- 📊 **Panel de administración** completo
- 🔐 **Sistema de autenticación** seguro
- 📱 **Interfaz responsive** y moderna

---

# 🚀 Guía de Instalación Rápida

## Prerrequisitos Multiplataforma

### Windows

- Instalar [Python 3.9+](https://www.python.org/downloads/)
- Instalar [Node.js](https://nodejs.org/)
- Instalar [Git](https://git-scm.com/)

### macOS

```bash
# Con Homebrew
brew install python3 nodejs git
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv git nodejs npm
```

## 📦 Instalación Paso a Paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/PauGracia/Biblioteca-Publica.git
cd Biblioteca-Publica
```

### 2. Configurar entorno virtual de Python

**Linux/macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias de Python

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 5. Configurar base de datos

```bash
python manage.py migrate
```

### 6. Preparar frontend React

**Instalar dependencias de Node.js:**

```bash
cd react
npm install
cd ..
```

**Linux/macOS:**

```bash
chmod +x deploy-react.sh
./deploy-react.sh
```

**Windows:**

```bash
# Ejecutar manualmente los comandos dentro de deploy-react.sh
# o usar Git Bash para ejecutar el script
```

### 7. Colectar archivos estáticos

```bash
python manage.py collectstatic --noinput
```

### 8. Poblar con datos de prueba

```bash
python manage.py generar_datos
```

### 9. Ejecutar servidor de desarrollo

```bash
python manage.py runserver
```

📖 **¡Listo! La aplicación estará disponible en:** [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## ⚠️ Solución de Problemas Comunes

### Error de permisos en scripts (Linux/macOS)

```bash
chmod +x deploy-react.sh
```

### Módulos de Python faltantes

```bash
pip install -r requirements.txt
```

### Problemas con Node.js (Windows)

Asegúrate de tener Node.js instalado y añadido al PATH.

### Dependencias de React faltantes

```bash
cd react
npm install
cd ..
```

### Conflictos de puertos

```bash
python manage.py runserver 8080  # Usar puerto alternativo
```

### ModuleNotFoundError: No module named 'django_extensions'

```bash
pip install django-extensions
```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de:

- 🐛 Reportar errores
- 💡 Sugerir nuevas características
- 🔧 Enviar pull requests
- 📚 Mejorar la documentación

## 📄 Licencia

Este es un proyecto de código abierto con fines educativos. Úsalo, modifícalo y compártelo libremente.

---

**¿Preguntas o problemas?** Abre un issue en el repositorio para obtener ayuda.

**¡Disfruta explorando el proyecto!** 🎉
