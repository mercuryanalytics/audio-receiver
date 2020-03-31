if (navigator.mediaDevices === undefined) (navigator as any).mediaDevices = {};

if (navigator.mediaDevices.getUserMedia === undefined) {
  const getUserMedia =
    (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia;
  if (getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(
      constraints?: MediaStreamConstraints
    ): Promise<MediaStream> {
      return new Promise((resolve, reject) =>
        getUserMedia.call(navigator, constraints, resolve, reject)
      );
    };
  }
}
