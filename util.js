// convert a hex color to the same color but in a certain opacity

export function hexColorWithOpacity(hex, opacity) {
    // Remove any hash symbol (#) if present in the hex value
    hex = hex.replace("#", "");
  
    // Convert the opacity to a decimal value (e.g., 30% -> 0.3)
    const alpha = opacity / 100;
  
    // Calculate the alpha channel value
    const alphaHex = Math.round(alpha * 255).toString(16);
  
    // Add leading zero if needed
    const alphaHexWithZero = alphaHex.length === 1 ? `0${alphaHex}` : alphaHex;
  
    // Combine the original hex color with the alpha channel
    const hexWithOpacity = `#${hex}${alphaHexWithZero}`;
  
    return hexWithOpacity;
  }

  export function adjustHexBrightness(hex, brightness) {
    // Remove any hash symbol (#) if present in the hex value
    hex = hex.replace("#", "");

    // Convert the brightness to a multiplier
    const multiplier = 1 + brightness / 100;

    // Parse the hex color to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Adjust the RGB values based on brightness
    r = Math.round(Math.min(255, r * multiplier));
    g = Math.round(Math.min(255, g * multiplier));
    b = Math.round(Math.min(255, b * multiplier));

    // Convert the adjusted RGB values back to hex
    const adjustedHex = `#${(r < 16 ? "0" : "") + r.toString(16)}${(g < 16 ? "0" : "") + g.toString(16)}${(b < 16 ? "0" : "") + b.toString(16)}`;

    return adjustedHex;
}

  

  export function lightOrDark(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>147.5) {

        return 'light';
    } 
    else {

        return 'dark';
    }
}

export function convertDateFormat(dateString) {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
  
export function calculateTimeDifference(deadlineDateString) {
    const currentDate = new Date();
    
   try {
    const [deadlineDatePart, timePart] = deadlineDateString.split(' ');
    const [year, month, day] = deadlineDatePart.split('/');
    const [hour, min ] = timePart.split(":")
    // console.log("[deadlineDatePart, timePart]: ",[deadlineDatePart, timePart]);
    // console.log("[year, month, day]: ",[year, month, day]);
    // console.log("[hour, min ]: ",[hour, min ]);
    // Set the deadline date to the end of the specified day
    const deadlineDate = new Date(year, month - 1, day, hour, min, 59);
  
    const timeDifference = deadlineDate - currentDate;
  
    if (timeDifference <= 0) {
      return -1;
    }
  
    let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let remainingTime = timeDifference % (1000 * 60 * 60 * 24);
  
    let hrs = Math.floor(remainingTime / (1000 * 60 * 60));
    remainingTime %= (1000 * 60 * 60);
  
    let mins = Math.floor(remainingTime / (1000 * 60));
  
    let result = "";
  
    if (days > 0) {
      result += `${days} ${days === 1 ? 'day' : 'days'} `;
    }
  
    if (hrs > 0) {
      result += `${hrs} ${hrs === 1 ? 'hr' : 'hrs'} `;
    }
  
    if (mins > 0) {
      result += `${mins} ${mins === 1 ? 'min' : 'mins'}`;
    }
  
    return result.trim();
   } catch (error) {
    return 'calculating...'
   }
}


export function sortDeadlinesByDate(deadlines) {
  return deadlines.sort((a, b) => {
    const dateA = extractDateValues(a.deadLine);
    const dateB = extractDateValues(b.deadLine);

    // If either date is null, prioritize the one that is not null
    if (!dateA || !dateB) {
      return dateA ? -1 : 1;
    }

    // Compare the date values
    for (let i = 0; i < dateA.length; i++) {
      if (dateA[i] !== dateB[i]) {
        return dateA[i] - dateB[i];
      }
    }

    return 0; // Dates are equal
  });
}

// Helper function to extract date values from the deadline string
function extractDateValues(deadline) {
  if (!deadline) {
    return null;
  }

  const match = deadline.match(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/);
  if (!match) {
    return null;
  }

  return match.slice(1).map(Number);
}
