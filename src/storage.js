/**
 * Storage
 *
 * Wrapper for using window.localStorage in a Cordova Application
 *
 * @company Usability Laboratory
 * @authors Sven Stolk
 *
 * @constructor
 * @param {string} name
 *
 * @requires Zepto|jQuery
 *
 * @returns {Storage}
 */
function Storage(name)
{
	/**
	 * Namespace in which the Storage index is saved
	 *
	 * @type {string}
	 */
	this.namespace = name;

	/**
	 * Updates the Storage index
	 *
	 * @param {object} index
	 */
	this.updateIndex = function (index)
	{
		window.localStorage.setItem(this.namespace + '.contents', this.json_encode(index));

		return this;
	};

	/**
	 * Adds a new key to the Storage index
	 *
	 * @param {string} key
	 * @param {string} dataType
	 *
	 * @returns {*}
	 */
	this.addToIndex = function(key, dataType)
	{
		var keyArray, index, group, child;

		index = this.index();
		keyArray = key.split('.');
		group = keyArray[0];
		child = keyArray[1];

		if ( !index.hasOwnProperty(group) )
		{
			index[group] = {};
		}

		index[group][child] = dataType;

		this.updateIndex(index);

		return index;
	};

	/**
	 * http://www.JSON.org/json2.js
	 * 2008-11-19
	 * Public Domain.
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 * See http://www.JSON.org/js.html
	 *
	 * @param {*} mixed_val
	 *
	 * @returns {*}
	 */
	this.json_encode = function (mixed_val)
	{

		var retVal, json = this.window.JSON;
		try
		{
			if ( typeof json === 'object' && typeof json.stringify === 'function' )
			{
				retVal = json.stringify(mixed_val);
				if ( retVal === undefined )
				{
					throw new SyntaxError('json_encode');
				}
				return retVal;
			}

			var value = mixed_val;
			var quote = function (string)
			{
				var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
				var meta = { // table of character substitutions
					'\b': '\\b',
					'\t': '\\t',
					'\n': '\\n',
					'\f': '\\f',
					'\r': '\\r',
					'"': '\\"',
					'\\': '\\\\'
				};

				escapable.lastIndex = 0;
				return escapable.test(string) ? '"' + string.replace(escapable, function (a)
				{
					var c = meta[a];
					return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				}) + '"' : '"' + string + '"';
			};
			var str = function (key, holder)
			{
				var gap = '';
				var indent = '    ';
				var i = 0; // The loop counter.
				var k = ''; // The member key.
				var v = ''; // The member value.
				var length = 0;
				var mind = gap;
				var partial = [];
				var value = holder[key];

				// If the value has a toJSON method, call it to obtain a replacement value.
				if ( value && typeof value === 'object' && typeof value.toJSON === 'function' )
				{
					value = value.toJSON(key);
				}

				// What happens next depends on the value's type.
				switch (typeof value)
				{
					case 'string':
						return quote(value);

					case 'number':
						// JSON numbers must be finite. Encode non-finite numbers as null.
						return isFinite(value) ? String(value) : 'null';

					case 'boolean':
					case 'null':
						// If the value is a boolean or null, convert it to a string. Note:
						// typeof null does not produce 'null'. The case is included here in
						// the remote chance that this gets fixed someday.
						return String(value);

					case 'object':
						// If the type is 'object', we might be dealing with an object or an array or
						// null.
						// Due to a specification blunder in ECMAScript, typeof null is 'object',
						// so watch out for that case.
						if ( !value )
						{
							return 'null';
						}
						if ( (this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource && value instanceof window.PHPJS_Resource) )
						{
							throw new SyntaxError('json_encode');
						}

						// Make an array to hold the partial results of stringifying this object value.
						gap += indent;
						partial = [];

						// Is the value an array?
						if ( Object.prototype.toString.apply(value) === '[object Array]' )
						{
							// The value is an array. Stringify every element. Use null as a placeholder
							// for non-JSON values.
							length = value.length;
							for (i = 0; i < length; i += 1)
							{
								partial[i] = str(i, value) || 'null';
							}

							// Join all of the elements together, separated with commas, and wrap them in
							// brackets.
							v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
							gap = mind;
							return v;
						}

						// Iterate through all of the keys in the object.
						for (k in value)
						{
							if ( Object.hasOwnProperty.call(value, k) )
							{
								v = str(k, value);
								if ( v )
								{
									partial.push(quote(k) + (gap ? ': ' : ':') + v);
								}
							}
						}

						// Join all of the member texts together, separated with commas,
						// and wrap them in braces.
						v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
						gap = mind;
						return v;
					case 'undefined':
					// Fall-through
					case 'function':
					// Fall-through
					default:
						throw new SyntaxError('json_encode');
				}
			};
			return str('', {
				'': value
			});

		}
		catch (err)
		{
			if ( !(err instanceof SyntaxError) )
			{
				throw new Error('Unexpected error type in json_encode()');
			}
			this.php_js = this.php_js || {};
			this.php_js.last_error_json = 4;
			return null;
		}
	};

	return this;
}

/**
 * Set a (new) localStorage item and adds it to the storage index
 *
 * In example: Setting a new localStorage item for 'session.username' will create a group 'session' with an item 'username'.
 * It will test out which type of data this item is and save this aswell. Your index will then look like this:
 *
 * namespace.contents = {
 *     session : [{username : 'string'}]
 * };
 *
 * Adding another session item ('session.password') will make the index look like this:
 *
 * namespace.contents = {
 *     session : [{username : "string", password : "string"}]
 * };
 *
 * @param {string} key
 * @param {*} value
 *
 * @returns {Storage}
 */
Storage.prototype.set = function (key, value)
{
	var dataType = typeof value;
	if ( dataType == 'object' )
	{
		window.localStorage.setItem(key, this.json_encode(value));
	}
	else
	{
		window.localStorage.setItem(key, value);
	}

	storage.add(key, dataType);

	return this;
};

/**
 * Retrieves the current Storage index and helps you see what is saved in the localStorage
 *
 * @param {string} [namespace=]
 *
 * @returns {*}
 */
Storage.prototype.index = function (namespace)
{
	namespace = (typeof namespace !== 'undefined') ? namespace : this.namespace;

	return this.get(namespace + '.contents', true);
};

/**
 * Retrieves a localStorage item and parses it as JSON if requested
 *
 * @param {string} key
 * @param {boolean} [parseJson=false]
 *
 * @returns {*}
 */
Storage.prototype.get = function (key, parseJson)
{
	if ( typeof parseJson !== 'undefined' && parseJson )
	{
		return (window.localStorage.getItem(key) !== null) ? $.parseJSON(window.localStorage.getItem(key)) : null;
	}
	else
	{
		return window.localStorage.getItem(key);
	}
};

/**
 * Retrieves a localStorage item based on the groupname
 *
 * @param {string} group
 *
 * @returns {{}}
 */
Storage.prototype.getGroup = function (group)
{
	var index, groupData = {};

	index = this.index();

	if ( index.hasOwnProperty(group) )
	{
		for (var item in index[group])
		{
			if ( index[group].hasOwnProperty(item) )
			{
				groupData[item] = this.get(group + '.' + item, true);
			}
		}
	}

	return groupData;
};

/**
 * Remove an item from the localStorage and the storage index
 *
 * @param {string} key
 *
 * @returns {boolean}
 */
Storage.prototype.remove = function (key)
{
	var index, keyArray, group, child;

	index = this.index();
	keyArray = key.split('.');
	group = keyArray[0];
	child = keyArray[1];

	if ( index.hasOwnProperty(group) && index[group].hasOwnProperty(child) )
	{
		window.localStorage.removeItem(group + '.' + child);
		delete index[group][child];
		this.updateIndex(index);

		return true;
	}

	return false;
};

/**
 * Removes an entire group from the localStorage and the storage index
 *
 * @param {string} group
 *
 * @returns {Storage}
 */
Storage.prototype.removeGroup = function (group)
{
	var index = this.index();

	if ( index.hasOwnProperty(group) )
	{
		for (var item in index[group])
		{
			window.localStorage.removeItem(group + '.' + item);
		}

		delete index[group];
	}

	this.update(index);

	return this;
};

/**
 * Removes the entire localStorage and storage index
 *
 * @returns {Storage}
 */
Storage.prototype.removeAll = function ()
{
	window.localStorage.clear();
	this.updateIndex({});

	return this;
};
