// fetchHelper.js

/**
 * For use with window.fetch
 */
export function jsonHeader(options = {}) {
  return Object.assign(options, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
}

// create formdata
export function createFormData(propertyData, fileArr) {
  let formData = new FormData();

  if (fileArr && fileArr.length > 0) {
    for (let i = 0; i < fileArr.length; i++) {
      if (fileArr[i].file) {
        formData.append('property[images][]', fileArr[i].file);
      }
    }
  } 
  if (propertyData) {
    // Set other params in the form data.
    formData.set('property[title]', propertyData.title);
    formData.set('property[id]', propertyData.id);
    formData.set('property[description]', propertyData.description);
    formData.set('property[city]', propertyData.city);
    formData.set('property[country]', propertyData.country);
    formData.set('property[property_type]', propertyData.property_type);
    formData.set('property[price_per_night]', propertyData.price_per_night);
    formData.set('property[max_guests]', propertyData.max_guests);
    formData.set('property[bedrooms]', propertyData.bedrooms);
    formData.set('property[beds]', propertyData.beds);
    formData.set('property[baths]', propertyData.baths);
    formData.set('property[attachment_id]', propertyData.attachment_id);
  }

  return formData;
}

// Additional helper methods

export function getMetaContent(name) {
  const header = document.querySelector(`meta[name="${name}"]`);
  return header && header.content;
}

export function getAuthenticityToken() {
  return getMetaContent('csrf-token');
}

export function authenticityHeader(options = {}) {
  return Object.assign(options, {
    'X-CSRF-Token': getAuthenticityToken(),
    'X-Requested-With': 'XMLHttpRequest',
  });
}

/**
* Lets fetch include credentials in the request. This includes cookies and other possibly sensitive data.
* Note: Never use for requests across (untrusted) domains.
*/
export function safeCredentials(options = {}) {
  return Object.assign(options, {
    credentials: 'include',
    mode: 'same-origin',
    headers: Object.assign((options.headers || {}), authenticityHeader(), jsonHeader()),
  });
}

// for image upload
export function safeCredentialsForm(options = {}) {
  return Object.assign(options, {
    credentials: 'include',
    mode: 'same-origin',
    headers: Object.assign((options.headers || {}), authenticityHeader()),
  });
}

export function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
}

export function handleLogout() {
  fetch('/api/sessions', {
    method: "DELETE",
    headers: { 'Content-Type': 'application/json' },
  })
  .then(handleErrors)
  .then(() => {
    window.location.href="/"
  })
  .catch(error => {
    console.log("logout error", error);
  })
}