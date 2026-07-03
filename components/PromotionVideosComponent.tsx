'use client';

import React, { useState, useRef } from 'react';
import { 
    Plus, 
    Trash2, 
    Play, 
    ArrowUp, 
    ArrowDown, 
    Link as LinkIcon, 
    Upload, 
    X, 
    Video as VideoIcon,
    AlertCircle,
    Loader2,
    Eye
} from 'lucide-react';
import Image from 'next/image';

export interface VideoItem {
    id?: string | number;
    title: string;
    videoUrl: string;
    thumbnailUrl?: string | null;
    order: number;
    isLocalFile?: boolean;
}

interface PromotionVideosComponentProps {
    videos: VideoItem[];
    onChange: (videos: VideoItem[]) => void;
}

export function getYoutubeId(url: string): string | null {
    if (!url) return null;
    try {
        const cleanUrl = url.trim();
        
        // 1. Check if it's a shorts link
        const shortsIndex = cleanUrl.toLowerCase().indexOf('/shorts/');
        if (shortsIndex !== -1) {
            const idPart = cleanUrl.substring(shortsIndex + 8);
            const id = idPart.split(/[?#&]/)[0];
            if (id && id.length === 11) return id;
        }
        
        // 2. Check if it's a youtu.be link
        const youtuebeIndex = cleanUrl.toLowerCase().indexOf('youtu.be/');
        if (youtuebeIndex !== -1) {
            const idPart = cleanUrl.substring(youtuebeIndex + 9);
            const id = idPart.split(/[?#&]/)[0];
            if (id && id.length === 11) return id;
        }
        
        // 3. Check if it's an embed link
        const embedIndex = cleanUrl.toLowerCase().indexOf('/embed/');
        if (embedIndex !== -1) {
            const idPart = cleanUrl.substring(embedIndex + 7);
            const id = idPart.split(/[?#&]/)[0];
            if (id && id.length === 11) return id;
        }

        // 4. Try standard URL query parsing for watch?v=
        if (cleanUrl.toLowerCase().includes('youtube.com')) {
            const urlObj = new URL(cleanUrl);
            const v = urlObj.searchParams.get('v');
            if (v && v.length === 11) return v;
        }
    } catch (e) {
        // Fallback to regex
    }

    // 5. Fallback regex
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

export function getVimeoId(url: string): string | null {
    if (!url) return null;
    try {
        const cleanUrl = url.trim();
        const vimeoIndex = cleanUrl.toLowerCase().indexOf('vimeo.com/');
        if (vimeoIndex !== -1) {
            const idPart = cleanUrl.substring(vimeoIndex + 10);
            const videoIndex = idPart.toLowerCase().indexOf('video/');
            const finalPart = videoIndex !== -1 ? idPart.substring(videoIndex + 6) : idPart;
            const id = finalPart.split(/[?#&]/)[0];
            if (id && /^\d+$/.test(id)) return id;
        }
    } catch (e) {
        // Fallback
    }

    const regExp = /vimeo\.com\/(?:video\/)?(\d+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

export function isYoutubeOrVimeo(url: string): boolean {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('vimeo.com');
}

export function getVideoThumbnail(url: string): string | null {
    const ytId = getYoutubeId(url);
    if (ytId) {
        return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    return null;
}

export function getEmbedUrl(url: string): string {
    const ytId = getYoutubeId(url);
    if (ytId) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const originParam = origin ? `&origin=${encodeURIComponent(origin)}` : '';
        return `https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1${originParam}`;
    }
    const vimeoId = getVimeoId(url);
    if (vimeoId) {
        return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
    }
    return url;
}


export default function PromotionVideosComponent({ videos = [], onChange }: PromotionVideosComponentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);
    const [title, setTitle] = useState('');
    const [sourceType, setSourceType] = useState<'url' | 'upload'>('url');
    const [url, setUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Max 5 videos
    const isLimitReached = videos.length >= 5;

    const handleAddVideoClick = () => {
        if (isLimitReached) {
            alert('Puedes agregar un máximo de 5 videos promocionales.');
            return;
        }
        setErrorMsg('');
        setTitle('');
        setUrl('');
        setFile(null);
        setSourceType('url');
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMsg('');
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Check file type
            if (!selectedFile.type.startsWith('video/')) {
                setErrorMsg('El archivo seleccionado debe ser un video (MP4, WebM, etc.).');
                setFile(null);
                return;
            }
            // Check size (50MB = 50 * 1024 * 1024 bytes)
            const maxSize = 50 * 1024 * 1024;
            if (selectedFile.size > maxSize) {
                setErrorMsg('El video supera el límite de 50MB permitidos.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            if (!title) {
                // Auto fill title with file name without extension
                setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleSaveVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!title.trim()) {
            setErrorMsg('El título del video es obligatorio.');
            return;
        }

        let finalUrl = '';
        let finalThumbnail = null;

        if (sourceType === 'url') {
            if (!url.trim()) {
                setErrorMsg('La URL del video es obligatoria.');
                return;
            }
            
            // Basic URL validation
            try {
                new URL(url);
            } catch {
                setErrorMsg('Por favor introduce una URL válida.');
                return;
            }

            finalUrl = url.trim();
            finalThumbnail = getVideoThumbnail(finalUrl);
        } else {
            if (!file) {
                setErrorMsg('Por favor selecciona un archivo de video.');
                return;
            }

            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (result.success && result.url) {
                    finalUrl = result.url;
                } else {
                    throw new Error(result.error || 'Error subiendo archivo');
                }
            } catch (err: any) {
                console.error(err);
                setErrorMsg('Error al subir el archivo: ' + (err.message || 'Error desconocido'));
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        const newVideo: VideoItem = {
            id: Math.random().toString(36).substring(2, 9),
            title: title.trim(),
            videoUrl: finalUrl,
            thumbnailUrl: finalThumbnail,
            order: videos.length,
            isLocalFile: sourceType === 'upload'
        };

        onChange([...videos, newVideo]);
        setIsModalOpen(false);
    };

    const handleRemoveVideo = (idToRemove: string | number) => {
        const filtered = videos.filter(v => v.id !== idToRemove);
        // Re-calculate orders
        const reordered = filtered.map((v, idx) => ({ ...v, order: idx }));
        onChange(reordered);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === videos.length - 1) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const newVideos = [...videos];
        
        // Swap items
        const temp = newVideos[index];
        newVideos[index] = newVideos[targetIndex];
        newVideos[targetIndex] = temp;

        // Re-assign order numbers
        const reordered = newVideos.map((v, idx) => ({ ...v, order: idx }));
        onChange(reordered);
    };

    return (
        <div className="videos-manager-container">
            <div className="videos-header-row">
                <div>
                    <h3 className="section-title">Videos Promocionales</h3>
                    <p className="section-subtitle">
                        Agrega hasta 5 videos (YouTube, Vimeo o carga directa) para destacar esta experiencia.
                    </p>
                </div>
                <button 
                    type="button"
                    onClick={handleAddVideoClick}
                    disabled={isLimitReached}
                    className="add-video-btn"
                >
                    <Plus size={16} />
                    <span>Agregar Video</span>
                </button>
            </div>

            {videos.length === 0 ? (
                <div className="videos-empty-state">
                    <VideoIcon size={36} opacity={0.2} style={{ marginBottom: '0.75rem' }} />
                    <p>No se han agregado videos promocionales aún.</p>
                </div>
            ) : (
                <div className="videos-list-container">
                    {videos.map((video, idx) => {
                        const isYt = getYoutubeId(video.videoUrl) !== null;
                        const isVim = getVimeoId(video.videoUrl) !== null;
                        const thumb = video.thumbnailUrl;

                        return (
                            <div key={video.id || idx} className="video-row-card glass-panel-video">
                                {/* Thumbnail area */}
                                <div className="video-thumb-preview">
                                    {thumb ? (
                                        <Image 
                                            src={thumb} 
                                            alt={video.title} 
                                            fill 
                                            className="thumb-img" 
                                            unoptimized 
                                        />
                                    ) : (
                                        <div className="generic-thumb-placeholder">
                                            {isYt || isVim ? <Play size={20} /> : <VideoIcon size={20} />}
                                        </div>
                                    )}
                                    <div className="video-badge-source">
                                        {isYt ? 'YouTube' : isVim ? 'Vimeo' : video.isLocalFile ? 'Archivo' : 'Enlace'}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="video-row-details">
                                    <div className="video-title">{video.title}</div>
                                    <div className="video-url">{video.videoUrl}</div>
                                </div>

                                {/* Actions */}
                                <div className="video-row-actions">
                                    <button 
                                        type="button" 
                                        onClick={() => setPreviewVideo(video)} 
                                        className="action-icon-btn preview"
                                        title="Vista Previa"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <div className="ordering-btns">
                                        <button 
                                            type="button" 
                                            onClick={() => handleMove(idx, 'up')} 
                                            disabled={idx === 0}
                                            className="action-icon-btn"
                                            title="Subir"
                                        >
                                            <ArrowUp size={14} />
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => handleMove(idx, 'down')} 
                                            disabled={idx === videos.length - 1}
                                            className="action-icon-btn"
                                            title="Bajar"
                                        >
                                            <ArrowDown size={14} />
                                        </button>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => video.id !== undefined && handleRemoveVideo(video.id)} 
                                        className="action-icon-btn delete"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Carga / Agregar Video */}
            {isModalOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content glass-modal-card">
                        <div className="modal-header">
                            <h3>Agregar Video Promocional</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="close-modal-btn">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveVideo} className="modal-form">
                            {errorMsg && (
                                <div className="error-alert">
                                    <AlertCircle size={16} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Título del Video</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej. Navegación al atardecer en Catamarán" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-input"
                                    disabled={uploading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Origen del Video</label>
                                <div className="tabs-container">
                                    <button 
                                        type="button" 
                                        className={`tab-btn ${sourceType === 'url' ? 'active' : ''}`}
                                        onClick={() => setSourceType('url')}
                                        disabled={uploading}
                                    >
                                        <LinkIcon size={14} />
                                        <span>Enlace URL (YouTube/Vimeo/S3)</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`tab-btn ${sourceType === 'upload' ? 'active' : ''}`}
                                        onClick={() => setSourceType('upload')}
                                        disabled={uploading}
                                    >
                                        <Upload size={14} />
                                        <span>Subir Archivo (Max 50MB)</span>
                                    </button>
                                </div>
                            </div>

                            {sourceType === 'url' ? (
                                <div className="form-group">
                                    <label className="form-label">Enlace URL del Video</label>
                                    <input 
                                        type="url" 
                                        placeholder="https://www.youtube.com/watch?v=..." 
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="form-input"
                                    />
                                    <span className="input-hint">Admite YouTube, Vimeo o enlaces directos a archivos de video (MP4/WebM).</span>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label className="form-label">Archivo de Video</label>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        accept="video/*" 
                                        onChange={handleFileChange}
                                        className="hidden-file-input"
                                        disabled={uploading}
                                    />
                                    <div 
                                        className={`file-dropzone ${file ? 'has-file' : ''}`}
                                        onClick={() => !uploading && fileInputRef.current?.click()}
                                    >
                                        {file ? (
                                            <div className="selected-file-info">
                                                <VideoIcon size={24} color="#8b5cf6" />
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                                                {!uploading && <span className="change-file-lbl">Haga clic para cambiar</span>}
                                            </div>
                                        ) : (
                                            <div className="empty-dropzone-info">
                                                <Upload size={28} opacity={0.4} />
                                                <span>Selecciona un video</span>
                                                <span className="hint-lbl">Formatos MP4, WebM. Límite de 50MB</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="modal-actions-footer">
                                <button 
                                    type="button" 
                                    className="btn-secondary" 
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={uploading}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-primary-video"
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Subiendo Video...</span>
                                        </>
                                    ) : (
                                        <span>Guardar Video</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Vista Previa del Video */}
            {previewVideo && (
                <div className="custom-modal-overlay" onClick={() => setPreviewVideo(null)} style={{ zIndex: 9000 }}>
                    <div className="video-player-modal-content" onClick={e => e.stopPropagation()}>
                        <button type="button" className="close-preview-btn" onClick={() => setPreviewVideo(null)}>
                            <X size={20} />
                        </button>
                        
                        <div className="video-player-aspect-wrapper">
                            {isYoutubeOrVimeo(previewVideo.videoUrl) ? (
                                <iframe 
                                    src={getEmbedUrl(previewVideo.videoUrl)}
                                    title={previewVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="preview-iframe"
                                />
                            ) : (
                                <video 
                                    src={previewVideo.videoUrl} 
                                    controls 
                                    autoPlay 
                                    className="preview-native-video"
                                />
                            )}
                        </div>
                        <div className="preview-video-meta">
                            <h4>{previewVideo.title}</h4>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .videos-manager-container {
                    margin-top: 2rem;
                    background: rgba(255,255,255,0.01);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 20px;
                    padding: 1.5rem;
                }
                .videos-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    gap: 1rem;
                }
                .section-title {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: white;
                    margin: 0 0 0.25rem 0;
                }
                .section-subtitle {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin: 0;
                }
                .add-video-btn {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 0.6rem 1.2rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .add-video-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(139, 92, 246, 0.4);
                }
                .add-video-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .videos-empty-state {
                    border: 2px dashed rgba(255,255,255,0.05);
                    border-radius: 16px;
                    padding: 3rem 1.5rem;
                    text-align: center;
                    color: rgba(255,255,255,0.3);
                    font-size: 0.85rem;
                }
                .videos-list-container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .video-row-card {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 0.75rem 1rem;
                    border-radius: 14px;
                    transition: all 0.3s;
                }
                .glass-panel-video {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.04);
                }
                .video-row-card:hover {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(139, 92, 246, 0.2);
                }
                .video-thumb-preview {
                    position: relative;
                    width: 90px;
                    height: 54px;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #111;
                    flex-shrink: 0;
                }
                .thumb-img {
                    object-fit: cover;
                }
                .generic-thumb-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255,255,255,0.3);
                }
                .video-badge-source {
                    position: absolute;
                    bottom: 3px;
                    left: 3px;
                    font-size: 0.55rem;
                    font-weight: 800;
                    color: white;
                    background: rgba(0,0,0,0.7);
                    padding: 0.1rem 0.3rem;
                    border-radius: 4px;
                    letter-spacing: 0.05em;
                }
                .video-row-details {
                    flex: 1;
                    min-width: 0;
                }
                .video-title {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.15rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .video-url {
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.3);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .video-row-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .action-icon-btn {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    color: rgba(255,255,255,0.6);
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-icon-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.08);
                    color: white;
                }
                .action-icon-btn:disabled {
                    opacity: 0.2;
                    cursor: not-allowed;
                }
                .action-icon-btn.preview:hover {
                    color: #8b5cf6;
                    border-color: rgba(139, 92, 246, 0.3);
                }
                .action-icon-btn.delete:hover {
                    color: #ef4444;
                    border-color: rgba(239, 68, 68, 0.3);
                }
                .ordering-btns {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .ordering-btns .action-icon-btn {
                    height: 16px;
                    width: 24px;
                    border-radius: 4px;
                    padding: 0;
                }
                
                /* Modals Styling */
                .custom-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(15px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    z-index: 8000;
                }
                .custom-modal-content {
                    width: 100%;
                    max-width: 500px;
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                    animation: modal-fade-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .glass-modal-card {
                    background: #0d0d0d;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.6);
                }
                @keyframes modal-fade-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .modal-header h3 {
                    font-size: 1.15rem;
                    font-weight: 800;
                    color: white;
                    margin: 0;
                }
                .close-modal-btn {
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.4);
                    cursor: pointer;
                    padding: 0.2rem;
                    border-radius: 50%;
                    display: flex;
                    transition: all 0.2s;
                }
                .close-modal-btn:hover {
                    color: white;
                    background: rgba(255,255,255,0.05);
                }
                .modal-form {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .error-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .form-label {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.6);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .form-input {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                    color: white;
                    outline: none;
                    font-size: 0.9rem;
                    transition: all 0.3s;
                }
                .form-input:focus {
                    border-color: #8b5cf6;
                    background: rgba(255,255,255,0.05);
                }
                .tabs-container {
                    display: flex;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 0.25rem;
                    gap: 0.25rem;
                }
                .tab-btn {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.4);
                    padding: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.4rem;
                    transition: all 0.2s;
                }
                .tab-btn.active {
                    background: rgba(139, 92, 246, 0.1);
                    color: #8b5cf6;
                }
                .input-hint {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.25);
                }
                .hidden-file-input {
                    display: none;
                }
                .file-dropzone {
                    border: 2px dashed rgba(255,255,255,0.08);
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    background: rgba(255,255,255,0.01);
                }
                .file-dropzone:hover {
                    border-color: #8b5cf6;
                    background: rgba(139, 92, 246, 0.02);
                }
                .file-dropzone.has-file {
                    border-style: solid;
                    border-color: rgba(139, 92, 246, 0.3);
                    background: rgba(139, 92, 246, 0.05);
                }
                .selected-file-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.4rem;
                }
                .file-name {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: white;
                    max-width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .file-size {
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.4);
                }
                .change-file-lbl {
                    font-size: 0.7rem;
                    color: #8b5cf6;
                    font-weight: 700;
                    margin-top: 0.5rem;
                }
                .empty-dropzone-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    color: rgba(255,255,255,0.5);
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .hint-lbl {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.25);
                }
                .modal-actions-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 0.75rem;
                }
                .btn-secondary {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    color: white;
                    border-radius: 12px;
                    padding: 0.75rem 1.5rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary:hover:not(:disabled) {
                    background: rgba(255,255,255,0.08);
                }
                .btn-secondary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .btn-primary-video {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 0.75rem 1.5rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s;
                }
                .btn-primary-video:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                }
                .btn-primary-video:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                /* Video Player Preview modal */
                .video-player-modal-content {
                    width: 100%;
                    max-width: 800px;
                    background: #000;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.1);
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.8);
                }
                .close-preview-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(0,0,0,0.6);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 100;
                    transition: all 0.2s;
                }
                .close-preview-btn:hover {
                    background: #ef4444;
                    border-color: #ef4444;
                }
                .video-player-aspect-wrapper {
                    position: relative;
                    padding-top: 56.25%; /* 16:9 Aspect Ratio */
                    background: #000;
                }
                .preview-iframe {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                .preview-native-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }
                .preview-video-meta {
                    padding: 1.25rem 1.5rem;
                    background: #0d0d0d;
                }
                .preview-video-meta h4 {
                    margin: 0;
                    color: white;
                    font-size: 1rem;
                    font-weight: 700;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
