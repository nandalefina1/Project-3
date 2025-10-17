document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const resultText = document.getElementById('resultText');
    const signImage = document.getElementById('signImage');
    const message = document.getElementById('message');

    // 1. Database Sederhana: Kata Kunci ke File Isyarat (GIF)
    const signDictionary = {
        "halo": "halo.gif",
        "terima kasih": "terimakasih.gif",
        "makan": "makan.gif",
        "air": "air.gif",
        "tolong": "tolong.gif"
        // Anda perlu menambahkan lebih banyak pasangan kata dan file GIF di folder images/
    };

    // Cek ketersediaan Speech Recognition API di browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        message.textContent = "❌ Maaf, browser Anda tidak mendukung Speech Recognition API.";
        startButton.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Set bahasa Indonesia
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // --- Event Listeners ---

    startButton.addEventListener('click', () => {
        // Reset tampilan
        resultText.textContent = "Mendengarkan...";
        signImage.style.display = 'none';
        signImage.src = '';
        message.textContent = '';
        
        recognition.start();
        startButton.textContent = "🔴 Sedang Bicara...";
        startButton.disabled = true;
    });

    recognition.addEventListener('result', (event) => {
        // Ambil hasil transkripsi
        const transcript = event.results[0][0].transcript.toLowerCase();
        resultText.textContent = transcript;

        // 2. Proses Pemetaan Kata
        const foundSign = findSign(transcript);

        if (foundSign) {
            // Tampilkan GIF yang cocok
            signImage.src = `images/${foundSign}`; 
            signImage.style.display = 'block';
            message.textContent = "✅ Isyarat Ditemukan.";
        } else {
            // Tampilkan pesan jika tidak ditemukan
            signImage.style.display = 'none';
            message.textContent = "⚠️ Isyarat tidak ditemukan untuk kata ini.";
        }
    });

    recognition.addEventListener('end', () => {
        // Setelah selesai, kembalikan tombol ke keadaan semula
        startButton.textContent = "🎤 Mulai Bicara";
        startButton.disabled = false;
    });

    recognition.addEventListener('error', (event) => {
        resultText.textContent = "Terjadi kesalahan.";
        message.textContent = `Error: ${event.error}`;
    });

    // --- Logika Pencarian Kata Kunci ---

    function findSign(transcript) {
        // Cek apakah transkripsi mengandung kata kunci dari database
        for (const word in signDictionary) {
            // Menggunakan includes() untuk mencocokkan kata kunci dalam kalimat
            if (transcript.includes(word)) {
                return signDictionary[word];
            }
        }
        return null;
    }
});
