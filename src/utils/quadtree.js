function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

class Point {
  constructor(x, y, userData) {
    this.x = x;
    this.y = y;
    this.userData = userData;
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rs = this.r * this.r;
  }

  contains(point) {
    let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
    return d <= this.rs;
  }

  intersects(range) {
    var xd = Math.abs(range.x - this.x);
    var yd = Math.abs(range.y - this.y);

    var r = this.r;

    var w = range.w;
    var h = range.h;

    var edges = Math.pow(xd - w, 2) + Math.pow(yd - h, 2);

    if (xd > r + w || yd > r + h) return false;
    if (xd <= w || yd <= h) return true;

    return edges <= this.rs;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  contains(point) {
    return (
      point.x <= this.x + this.w &&
      point.x >= this.x - this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }
  intersects(range) {
    return !(
      range.x - range.w >= this.x + this.w ||
      range.x + range.w <= this.x - this.w ||
      range.y + range.h <= this.y - this.h ||
      range.y - range.h >= this.y + this.h
    );
  }
}

class Quadtree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.pointscopy = [];
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.northwest = new Quadtree(nw, this.capacity);
    this.northeast = new Quadtree(ne, this.capacity);
    this.southwest = new Quadtree(sw, this.capacity);
    this.southeast = new Quadtree(se, this.capacity);
    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return;
    }
    if (this.points.length < this.capacity && !this.divided) {
      this.points.push(point);
      this.pointscopy.push(point);
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      for (let p of this.points) {
        if (this.northeast.boundary.contains(p)) {
          this.northeast.points.push(p);
        } else if (this.southeast.boundary.contains(p)) {
          this.southeast.points.push(p);
        } else if (this.northwest.boundary.contains(p)) {
          this.northwest.points.push(p);
        } else if (this.southwest.boundary.contains(p)) {
          this.southwest.points.push(p);
        }
        this.points = [];
      }

      if (this.northeast.boundary.contains(point)) {
        this.northeast.insert(point);
      } else if (this.southeast.boundary.contains(point)) {
        this.southeast.insert(point);
      } else if (this.northwest.boundary.contains(point)) {
        this.northwest.insert(point);
      } else if (this.southwest.boundary.contains(point)) {
        this.southwest.insert(point);
      }
    }
  }

  query(range) {
    let found = [];
    if (!this.boundary.intersects(range)) {
      return found;
    }
    if (this.divided) {
      if (this.northeast.boundary.intersects(range)) {
        found = found.concat(this.northeast.query(range));
      }
      if (this.northwest.boundary.intersects(range)) {
        found = found.concat(this.northwest.query(range));
      }
      if (this.southeast.boundary.intersects(range)) {
        found = found.concat(this.southeast.query(range));
      }
      if (this.southwest.boundary.intersects(range)) {
        found = found.concat(this.southwest.query(range));
      }
      return found;
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
      return found;
    }
  }

  //   show() {
  //     strokeWeight(0.1);
  //     stroke(255);
  //     noFill();
  //     rectMode(CENTER);
  //     rect(
  //       this.boundary.x,
  //       this.boundary.y,
  //       this.boundary.w * 2,
  //       this.boundary.h * 2
  //     );
  //     if (this.divided) {
  //       this.northwest.show();
  //       this.northeast.show();
  //       this.southeast.show();
  //       this.southwest.show();
  //     }
  //     for (let p of this.pointscopy) {
  //       strokeWeight(2);
  //       point(p.x + 400, p.y);
  //       point(p.x, p.y);
  //     }
  //   }
}
