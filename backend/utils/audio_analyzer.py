import sounddevice as sd
import numpy as np
import librosa

def get_audio_mfcc_entropy(duration=3, fs=16000):
    try:
        audio = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='float32')
        sd.wait()
        audio = audio.flatten()
        mfccs = librosa.feature.mfcc(y=audio, sr=fs, n_mfcc=13)
        variances = np.var(mfccs, axis=1)
        entropy = np.mean(variances) / (np.max(variances)+1e-6)
        return round(float(entropy),3)
    except Exception:
        return 0.6
