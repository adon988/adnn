'use strict';

var Tensor = require('../tensor.js');
var THTensor = require('../THTensor.js'); // tensor = tensor
var jstenFunc = require('./adjs/tensorFunctions.js')
var thtenFunc = require('./adTH/tensorFunctions.js')
var graph = require('./graph.js');
var Node = graph.Node;
var func = require('./func.js');
//var derivs = require('./derivatives.js');
var _ = require('lodash')

var fns = {tensor: {}};

// Tensor reductions  -----------------------------------------------------

var Scalar = Number

fns.tensor.sumreduce = function (t) {
    var ten = t instanceof Node ? t.x : t;
    if (ten instanceof Tensor)
        return jstenFunc.tensor.sumreduce(t);
    return thtenFunc.thtensor.sumreduce(t);
}

fns.tensor.allreduce = func.liftUnaryFunction(function(t) {
    return t.allreduce();
});

fns.tensor.anyreduce = func.liftUnaryFunction(function(t) {
    return t.anyreduce();
});

// TODO: min/max?


// Scalar/tensor shaping operations ---------------------------------------


// Select one entry out of a tensor (by linear indexing)
fns.tensor.get = function (t, i) {
    var ten = t instanceof Node ? t.x : t;
    if (ten instanceof Tensor)
        return jstenFunc.tensor.get(t, i);
    return thtenFunc.thtensor.get(t, i);
}

// Split a tensor into an array of its scalar entries
fns.tensor.toScalars = function (t) {
    var ten = t instanceof Node ? t.x : t;
    if (ten instanceof Tensor)
        return jstenFunc.tensor.toScalars(t);
    return thtenFunc.thtensor.toScalars(t);
}

// Select a subtensor from a larger tensor
// TODO: Eventually implement this as a view into existing storage,
//    probably using refClone (+ other new stuff)
fns.tensor.range = function (t, start, end) {
    var ten = t instanceof Node ? t.x : t;
    if (ten instanceof Tensor)
        return jstenFunc.tensor.range(t, start, end);
    return thtenFunc.thtensor.range(t, start, end);
}


// Split a tensor into multiple smaller tensors
fns.tensor.split = function(t, lengths) {
    var ten = t instanceof Node ? t.x : t;
    if (ten instanceof Tensor)
        return jstenFunc.tensor.split(t, lengths);
    return thtenFunc.thtensor.split(t, lengths);
}

// Concatentate multiple scalars into a tensor
// argument to differentiate torch or js tensor
fns.tensor.fromScalars = function(t, isTH) {
    if (isTH)
        return thtenFunc.thtensor.fromScalars(t);
    return jstenFunc.tensor.fromScalars(t);
}

// Concatentate multiple tensors into one big tensor
// Can either take an array of tensors or a variable number of arguments
// TODO: Eventually implement this as views into multiple storages?
// No offset copying, so right now this implementation is working but slow
fns.tensor.concat = function(t) {
    var ten = t instanceof Node ? t.x : t;
    if (ten instanceof Tensor)
        return jstenFunc.tensor.concat(t);
    return thtenFunc.thtensor.concat(t);
}

// Reshape a tensor
// Creates a new TensorNode whose x and dx fields are refClones
//    of the corresponding fields on the input node.
fns.tensor.reshape = function(t, dims) {
    if (t instanceof Node) {
        var node = t.refClone();
        node.x.reshape(dims);
        node.dx.reshape(dims);
        return node;
    } else {
        var ref = t.refClone();
        ref.reshape(dims);
        return ref;
    }
};

// http://stats.stackexchange.com/questions/79454/softmax-layer-in-a-neural-network
fns.tensor.softmax = function(t, lengths) {
    var ten = t instanceof Node ? t.x : t;
    if (ten instanceof Tensor)
        return jstenFunc.tensor.softmax(t, lengths);
    return thtenFunc.thtensor.softmax(t, lengths);
}

module.exports = fns;