# Chan's Algorithm Demo

My final project for the Computational Geometry course (COMP 163) at Tufts.

### Motivation

Over the semester I learned about several algorithms used to compute the convex hull of a point set or a polygon. The course covered Gift Wrapping (Jarvis March), Graham Scan, Quickhull, Melkman, Kirkpatrick–Seidel (Ultimate), and finally, Chan's Algorithm.

Chan's Algorithm, named after Timothy M. Chan, is an optimal output-sensitive algorithm to compute the convex hull of a point set in ``O(nlogh)`` time. The variable ``n`` is the total number of points and ``h`` is the number of points that end up being on the convex hull (hence output sensitive).

The reason I chose to do my final project on Chan's algorithm is because of three features that make this algorithm particularly interesting to me.

 - Utilizes other (more complex) algorithms
 - Throws away valuable work and starts over
 - Uses a geometric series to avoid ``n^2`` runtime

### Goals

- Walk through the steps of Chan's Algorithm
- Allow the user to interact with the input data
- Include animations that enhance understanding of the algorithm
