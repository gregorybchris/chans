# Chan's Algorithm Demo

My final project for the Computational Geometry course (COMP 163) at Tufts.

### Background

Over the semester I learned about several algorithms used to compute the convex hull of a point set or a polygon. The course covered Gift Wrapping (Jarvis March), Graham Scan, Quickhull, Monotone Chain, Melkman, Kirkpatrick & Seidel (Ultimate), and finally, Chan's Algorithm.

Chan's Algorithm, named after Timothy M. Chan, is an optimal output-sensitive algorithm to compute the convex hull of a point set in ``O(nlogh)`` time. The variable ``n`` is the total number of points and ``h`` is the number of points on the output convex hull (hence output-sensitive).

### Motivation

The reason I chose to do my final project on Chan's algorithm is because of three features that make this algorithm particularly interesting to me.

 - Utilizes other (slower) algorithms
 - Throws away valuable work and starts over
 - Uses a geometric series to turn ``O(n^2)`` into ``O(n)`` runtime

### Goals

- Walk through the steps of Chan's Algorithm
- Allow the user to interact with the input data
- Include animations that enhance understanding of the algorithm
