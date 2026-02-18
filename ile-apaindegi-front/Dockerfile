FROM node:20-alpine

WORKDIR /app

# Copiamos archivos de dependencias primero para aprovechar la caché de capas
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Forzamos a que escuche en 0.0.0.0 para que Nginx pueda encontrarlo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]