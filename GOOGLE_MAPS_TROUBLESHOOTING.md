# Google Maps Autocomplete Troubleshooting Guide

## 🔍 Issue: No Suggestions Appearing When Typing

If you're not seeing address suggestions in the search field, follow these steps to diagnose and fix the issue:

---

## Step 1: Check Browser Console

Open your browser's Developer Tools (F12 or Right-click → Inspect) and check the Console tab for messages:

### ✅ What You Should See (Working):

```
🔄 Loading Google Maps API...
✅ Google Maps API loaded successfully
🔄 Initializing Google Places Autocomplete...
✅ Autocomplete initialized
```

### ❌ Common Error Messages:

#### Error 1: API Key Issues

```
Google Maps JavaScript API error: RefererNotAllowedMapError
```

**Solution**: The API key is restricted and doesn't allow your domain.

**Fix**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "Credentials"
4. Click on your API key
5. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add these URLs:
     - `http://localhost:*`
     - `http://127.0.0.1:*`
     - `http://192.168.*.*:*` (for local network testing)
     - Your production domain (e.g., `https://yourdomain.com/*`)
6. Save changes

#### Error 2: Billing Not Enabled

```
Google Maps JavaScript API error: BillingNotEnabledMapError
```

**Solution**: Enable billing on your Google Cloud account.

**Fix**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable billing for your project
3. Google provides $200 free credit per month

#### Error 3: API Not Enabled

```
Google Maps JavaScript API error: ApiNotActivatedMapError
```

**Solution**: Enable the required APIs.

**Fix**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to "APIs & Services" → "Library"
3. Enable these APIs:
   - ✅ Maps JavaScript API
   - ✅ Places API
4. Wait 5-10 minutes for changes to propagate

#### Error 4: Invalid API Key

```
Google Maps JavaScript API error: InvalidKeyMapError
```

**Solution**: The API key is invalid or incorrect.

**Fix**: Verify the API key in the code matches your Google Cloud Console key.

---

## Step 2: Verify API Key Configuration

### Current API Key

The API key is configured in: `src/components/parents/forms/AddressForm.tsx`

```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD15fDdmqNVINe8CtDWJkUJD3TNVIbg_B8&libraries=places`;
```

### Verify in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Find API key: `AIzaSyD15fDdmqNVINe8CtDWJkUJD3TNVIbg_B8`
4. Check if it exists and is active

---

## Step 3: Test API Key Directly

Open this URL in your browser (replace with your actual API key):

```
https://maps.googleapis.com/maps/api/js?key=AIzaSyD15fDdmqNVINe8CtDWJkUJD3TNVIbg_B8&libraries=places
```

### ✅ Success Response:

You should see JavaScript code (not an error message)

### ❌ Error Response:

If you see an error message, it indicates:

- Invalid API key
- API not enabled
- Billing issues
- Domain restrictions

---

## Step 4: Check Network Tab

In Developer Tools, go to the "Network" tab:

1. Clear the network log
2. Open the "Add Address" dialog
3. Look for a request to `maps.googleapis.com`

### What to Check:

- **Status Code**: Should be `200` (success)
- **Response**: Should contain JavaScript code
- **If 403**: API key restrictions issue
- **If 404**: API not found/disabled
- **If blocked**: CORS or network issue

---

## Step 5: Test with a Simple Fix

If autocomplete still doesn't work, try these quick fixes:

### Fix 1: Remove Country Restriction

The autocomplete is currently restricted to Kenya. Try removing this restriction:

In `AddressForm.tsx`, change:

```typescript
autocompleteRef.current = new window.google.maps.places.Autocomplete(
  searchInputRef.current,
  {
    types: ["geocode", "establishment"],
    componentRestrictions: { country: "ke" }, // ← Remove this line
  }
);
```

To:

```typescript
autocompleteRef.current = new window.google.maps.places.Autocomplete(
  searchInputRef.current,
  {
    types: ["geocode", "establishment"],
  }
);
```

### Fix 2: Try Different Search Types

Change the `types` array:

```typescript
// Current (restrictive)
types: ["geocode", "establishment"];

// Try this (more permissive)
types: ["geocode"];

// Or this (all places)
types: [];
```

### Fix 3: Clear Browser Cache

1. Open Developer Tools
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Try again

---

## Step 6: Alternative - Use Manual Entry

If Google Maps continues to have issues, users can use the **Manual Entry** tab:

1. Click "Manual Entry" tab
2. Enter address manually
3. Enter coordinates:
   - Go to [Google Maps](https://www.google.com/maps)
   - Right-click on location
   - Click "What's here?"
   - Copy latitude and longitude
4. Submit

---

## Step 7: Common Pitfalls

### ❌ Don't:

- Press "Enter" after typing (suggestions won't work)
- Type very generic terms like "Nairobi" only
- Expect instant results (allow 1-2 seconds for suggestions)

### ✅ Do:

- **Click** on a suggestion from the dropdown
- Be specific: "Westlands Avenue, Nairobi" instead of just "Nairobi"
- Wait for the green "Google Maps Ready!" message
- Check browser console for errors

---

## Testing Checklist

Use this checklist to verify your setup:

- [ ] Open browser console (F12)
- [ ] Navigate to Parents & Students page
- [ ] Click on a parent
- [ ] Go to Addresses tab
- [ ] Click "Add Address" button
- [ ] Check for "✅ Google Maps API loaded successfully" in console
- [ ] Check for "✅ Autocomplete initialized" in console
- [ ] Check for green "Google Maps Ready!" message in UI
- [ ] Type "Westlands, Nairobi" in search field
- [ ] Wait 2 seconds for suggestions
- [ ] Suggestions should appear below input
- [ ] Click a suggestion
- [ ] Coordinates should fill automatically
- [ ] Green "Coordinates Detected" box should appear

---

## Still Not Working?

### Check These:

1. **Internet Connection**: Ensure stable internet
2. **Ad Blockers**: Disable ad blockers (they sometimes block Google APIs)
3. **Browser Extensions**: Try in incognito mode
4. **Browser Compatibility**: Use Chrome, Firefox, or Edge (latest versions)
5. **HTTPS vs HTTP**: Some browsers restrict APIs on HTTP

### Get Detailed Logs:

Add this to your browser console to see detailed info:

```javascript
// Check if Google Maps is loaded
console.log("Google loaded?", !!window.google);
console.log("Places API?", !!window.google?.maps?.places);

// Check input element
const input = document.querySelector("#search-location");
console.log("Input element:", input);
```

---

## Quick Reference: API Key Restrictions Setup

### Recommended Settings:

**Application Restrictions:**

- Type: HTTP referrers (web sites)
- Referrers:
  - `http://localhost:*`
  - `http://127.0.0.1:*`
  - `http://192.168.*.*:*`
  - `https://yourdomain.com/*`

**API Restrictions:**

- Restrict to:
  - Maps JavaScript API
  - Places API
  - Geocoding API (optional)

**Billing:**

- ✅ Billing must be enabled
- Set budget alerts at $50, $100, $150

---

## Contact Support

If none of these solutions work:

1. **Check Google Cloud Status**: https://status.cloud.google.com/
2. **Review API Quotas**: Check if you've exceeded your quota
3. **Use Manual Entry**: Always available as fallback

---

## Success Indicators

When everything works correctly, you should see:

✅ Green "Google Maps Ready!" message in UI  
✅ Console shows successful load messages  
✅ Suggestions appear within 1-2 seconds of typing  
✅ Clicking suggestion fills address and coordinates  
✅ Green "Coordinates Detected" box appears  
✅ No error messages in console

Good luck! 🚀
