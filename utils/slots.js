function generateSlots() {
    const slots = [];
    let start = 9 * 60;
    let end = 18 * 60;
  
    for (let t = start; t < end; t += 15) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      slots.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      );
    }
    return slots;
  }
  
  module.exports = generateSlots;
  