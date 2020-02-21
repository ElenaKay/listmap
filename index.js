
var has = function() {
  var H = {}.hasOwnProperty;
  return function has(o,n) {
    return H.call(o,n);
  };
}();

function ListMap() {
  this.keyList = [];
  this.valueMap = {};
  this.length = 0;
}

var cls = ListMap.prototype;

cls._has = function(name) {
  return has(this.valueMap, name); 
};
cls.has = function(name) {
  return this._has(this.mangle(name)); 
};

cls._get = function(name) {
  var m = this.valueMap;
  if (has(m, name))
    return m[name];
  this.errNSK(name);
};
cls.get = function(name) {
  return this._get(this.mangle(name));
};

cls._set = function(name,v) {
  var isNew;
  if (this._has(name))
    isNew = false;
  else {
    isNew = true;
    this.keyList.push(name);
    this.length += 1;
  }
  this.valueMap[name] = v;
  return isNew;
};
cls.set = function(name,v) {
  return this._set(this.mangle(name), v);
};

cls.valueAt = function(idx) {
  return this.valueMap[this._keyAt(idx)];
};

cls._keyAt = function(idx) {
  if (idx < 0 || idx >= this.length)
    this.errNIR(idx);
  return this.keyList[idx];
};
cls.keyAt = function(idx) {
  return this.unmangle(this._keyAt(idx));
};

cls._locateKey = function(name) {
  return this.keyList.indexOf(name);
};
cls.locateKey = function(name) {
  return this._locateKey(this.mangle(name));
};

cls._deleteKey = function(name, errLess) {
  var idx = this._locateKey(name);
  if (idx < 0) {
    if (errLess)
      return false;
    this.errNSK(name);
  }
  return this.removeIndexNoChk(idx);
};
cls.deleteKey = function(name, errLess) {
  return this._deleteKey(name, errLess);
};

cls.removeIndexNoChk = function(idx) {
  var keyList = this.keyList;
  var length = this.length;
  var next = idx + 1;
  var rm = keyList[idx];

  while (next < length) {
    keyList[idx] = keyList[next];
    idx = next++;
  }
  this.length = length - 1;

  keyList.pop();
  delete this.valueMap[rm];

  return true;
};
cls.removeIndex = function(idx, errLess) {
  if (idx >= 0 && idx < this.length)
    return this.removeIndexNoChk(idx);
  return errLess ? false : this.errNIR(idx);
};

var ST_HASH = '#';
var CH_HASH = ST_HASH.charCodeAt(0);

cls.mangle = function(name) {
  var len = name.length;
  if (len > 0 && (name.charCodeAt(len-1) === CH_HASH || name === '__proto__'))
    return name+ST_HASH;
  return name;
};
cls.unmangle = function(name) {
  var len = name.length;
  if (name.charCodeAt(len-1) === CH_HASH)
    return name.substring(0,len-1);
  return name;
};

cls.errNSK = function(name) {
  throw new Error('No such key: {'+name+'}, Unmangled {'+this.unmangle(name)+'}');
};
cls.errNIR = function(idx) {
  throw new Error('idx {'+idx+'}'+'not in range [0..' + (this.length-1));
};

module.exports.ListMap = ListMap;
module.exports.LM = ListMap;
