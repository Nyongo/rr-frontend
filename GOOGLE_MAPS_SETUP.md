# Google Maps API Setup Guide

## Overview

The AddressForm component now supports two methods for entering location data:

1. **Google Maps Search** - Search for addresses with autocomplete suggestions
2. **Manual Entry** - Directly input coordinates and address

## Setting Up Google Maps API

### Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:

   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API** (optional, for address validation)

4. Go to "Credentials" and create an API key
5. **Important**: Restrict your API key:
   - Application restrictions: HTTP referrers (websites)
   - Add your website URLs (e.g., `http://localhost:*`, `https://yourdomain.com/*`)
   - API restrictions: Select only the APIs you enabled above

### Step 2: Add API Key to Your Project

The API key has already been configured in the AddressForm component:

**File**: `src/components/parents/forms/AddressForm.tsx`

**Current Configuration**:

```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD15fDdmqNVINe8CtDWJkUJD3TNVIbg_B8&libraries=places`;
```

✅ **API Key Configured**: The Google Maps API key is already set up and ready to use.

### Step 3: Environment Variables (Recommended)

For better security, use environment variables:

1. Create a `.env` file in your project root:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

2. Update the component to use the environment variable:

```typescript
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_FALLBACK_KEY";
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
```

3. Add `.env` to your `.gitignore` to keep the key private

### Step 4: Configure for Kenya (or your region)

The component is currently configured to restrict searches to Kenya:

```typescript
componentRestrictions: {
  country: "ke";
}
```

To change this:

- `'ke'` = Kenya
- `'us'` = United States
- `'gb'` = United Kingdom
- Remove this line to search globally

## Features

### Search Location Method

- **Auto-complete**: As users type, Google Maps provides address suggestions
- **Auto-fill coordinates**: When an address is selected, longitude and latitude are automatically filled
- **Real-time feedback**: Toast notification confirms when location is selected
- **Country restriction**: Limited to Kenya by default

### Manual Entry Method

- **Direct input**: Users can type the full address manually
- **Coordinate fields**: Longitude and Latitude input fields
- **Helpful hints**: Tooltips guide users on how to find coordinates
- **Validation**: Ensures coordinates are provided before submission

## Usage

### For Users

1. **Select Address Type**: Choose Home, Office, Relative, or Other
2. **Choose Input Method**:
   - **Search Location Tab**: Type address, select from suggestions
   - **Manual Entry Tab**: Enter address and coordinates manually
3. **Set Status**: Active or Inactive
4. **Mark as Primary**: Optionally mark as primary address
5. **Submit**: Click "Add Address"

### For Developers

The component handles:

- ✅ Google Maps API loading
- ✅ Places Autocomplete initialization
- ✅ Coordinate extraction from selected places
- ✅ Validation before submission
- ✅ Error handling for failed API loads
- ✅ Graceful fallback to manual entry

## Troubleshooting

### Google Maps not loading?

- Check API key is correct
- Verify APIs are enabled in Google Cloud Console
- Check browser console for error messages
- Ensure HTTP referrer restrictions allow your domain

### Autocomplete not working?

- Verify Places API is enabled
- Check network tab for API requests
- Switch to Manual Entry tab as fallback

### Coordinates not auto-filling?

- Ensure you select an address from the dropdown (don't just press Enter)
- Check that the selected place has geometry data
- Use Manual Entry if issues persist

## Cost Considerations

- Google Maps provides $200 free credit monthly
- Places Autocomplete: ~$17 per 1,000 requests
- Consider implementing autocomplete session tokens to reduce costs
- Monitor usage in Google Cloud Console

## Best Practices

1. **Restrict your API key** - Prevent unauthorized use
2. **Use environment variables** - Keep keys secure
3. **Monitor usage** - Set up billing alerts
4. **Implement rate limiting** - Prevent abuse
5. **Have a fallback** - Manual entry ensures functionality even if Maps fails

## Support

For issues or questions:

- Google Maps Platform documentation: https://developers.google.com/maps
- Places API documentation: https://developers.google.com/maps/documentation/places/web-service
