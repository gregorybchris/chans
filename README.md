# Chan's Algorithm Demo

My final project for the Computational Geometry course (COMP 163) at Tufts.

### Background

Over the semester I learned about several algorithms used to compute the convex hull of a point set or a polygon. The course covered Gift Wrapping (Jarvis March), Graham Scan, Quickhull, Monotone Chain, Melkman, Sklansky, Kirkpatrick & Seidel (Ultimate), and finally, Chan's Algorithm.

Chan's Algorithm (named after it's inventor, Timothy M. Chan) is an optimal output-sensitive algorithm to compute the convex hull of a point set in ``O(nlogh)`` time. The variable ``n`` is the total number of input points and ``h`` is the number of output points on the convex hull (hence output-sensitive).

[Link to the paper](http://www.cs.ucsb.edu/~suri/cs235/ChanCH.pdf)

### Motivation

The reason I chose to do my final project on Chan's algorithm is because of three features that make this algorithm particularly interesting to me.

- Utilizes other (slower) algorithms to achieve a faster result.
- Throws away valuable work and starts over.
- Uses a geometric progression to reduce a part of the overall runtime from potentially quadratic to linear.

### Goals

- Walk through the steps of Chan's Algorithm
- Allow the user to interact with the input data
- Include animations that enhance understanding of the algorithm

### Libraries

- D3.js
- Velocity.js
- Less.js
