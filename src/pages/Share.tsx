export function SharePage({ fileKey, fileName, contentType }: { fileKey: string, fileName: string, contentType: string }) {
  const url = `/api/share/${fileKey}`
  const isImage = contentType.startsWith('image/')
  const isPdf = contentType === 'application/pdf'
  const isVideo = contentType.startsWith('video/')
  const isAudio = contentType.startsWith('audio/')
  
  return (
    <div className="share-page">
      <div className="share-container">
        <div className="share-preview">
          {isImage && <img src={url} alt={fileName} />}
          {isPdf && <iframe src={url} title={fileName}></iframe>}
          {isVideo && <video controls src={url}></video>}
          {isAudio && (
            <div className="audio-preview">
              <div className="audio-icon">🎵</div>
              <audio controls src={url}></audio>
            </div>
          )}
          {!isImage && !isPdf && !isVideo && !isAudio && (
            <div className="no-preview">
              <div className="file-icon">📎</div>
              <p>Preview not available</p>
            </div>
          )}
        </div>
        <div className="share-info">
          <h1>{fileName}</h1>
          <a href={url} download={fileName} className="btn-download">Download</a>
        </div>
      </div>
    </div>
  )
}

