let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Handle mouse and touch movements
    const moveHandler = (e) => {
      const eventX = e.touches ? e.touches[0].clientX : e.clientX;
      const eventY = e.touches ? e.touches[0].clientY : e.clientY;
      
      if (!this.rotating) {
        this.mouseX = eventX;
        this.mouseY = eventY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = eventX - this.mouseTouchX;
      const dirY = eventY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Handle mouse and touch start
    const startHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const eventX = e.touches ? e.touches[0].clientX : e.clientX;
      const eventY = e.touches ? e.touches[0].clientY : e.clientY;

      if (e.touches || e.button === 0) {
        this.mouseTouchX = eventX;
        this.mouseTouchY = eventY;
        this.prevMouseX = eventX;
        this.prevMouseY = eventY;
      }
      if (!e.touches && e.button === 2) {
        this.rotating = true;
      }
    };

    // Handle mouse and touch end
    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('touchmove', moveHandler);
    paper.addEventListener('mousedown', startHandler);
    paper.addEventListener('touchstart', startHandler);
    window.addEventListener('mouseup', endHandler);
    window.addEventListener('touchend', endHandler);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
