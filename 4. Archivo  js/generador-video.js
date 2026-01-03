// Evento para generar el video
document.getElementById('generar-video').addEventListener('click', async () => {
    const recursos = obtenerRecursosBot();
    if (!recursos) return;

    // Mostrar cargando
    document.getElementById('sin-previsualizacion').textContent = "Generando video...";

    try {
        // Crear elementos de video y audio
        const video = document.createElement('video');
        const audio = document.createElement('audio');
        
        video.src = recursos.videoSrc;
        audio.src = recursos.audioSrc;
        video.muted = true; // Para cargar sin reproducir sonido
        video.crossOrigin = "anonymous";

        // Esperar a que carguen los recursos
        await Promise.all([
            new Promise(resolve => video.onloadeddata = resolve),
            new Promise(resolve => audio.onloadeddata = resolve)
        ]);

        // Crear canvas para combinar video, audio y texto
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Configurar resolución para redes sociales (vertical)
        canvas.width = 1080;
        canvas.height = 1920;

        // Ajustar video al canvas
        const escala = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
        const x = (canvas.width - video.videoWidth * escala) / 2;
        const y = (canvas.height - video.videoHeight * escala) / 2;

        // Configurar MediaRecorder
        const stream = canvas.captureStream(30);
        const audioStream = audio.captureStream();
        // Combinar streams de video y audio
        const combinado = new MediaStream([
            ...stream.getVideoTracks(),
            ...audioStream.getAudioTracks()
        ]);

        const recorder = new MediaRecorder(combinado, { mimeType: 'video/mp4' });
        const chunks = [];

        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            
            // Mostrar previsualización y enlace de descarga
            const videoPreview = document.getElementById('video-preview');
            const enlaceDescarga = document.getElementById('enlace-descarga');
            
            videoPreview.src = url;
            enlaceDescarga.href = url;
            
            document.getElementById('previsualizacion').classList.remove('d-none');
            document.getElementById('sin-previsualizacion').classList.add('d-none');
        };

        // Iniciar grabación
        recorder.start();
        video.play();
        audio.play();

        // Dibujar frame por frame con texto
        function dibujarFrame() {
            if (video.ended) {
                recorder.stop();
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, x
          
