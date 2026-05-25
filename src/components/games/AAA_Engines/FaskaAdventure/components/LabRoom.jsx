import React from 'react';
import useAdventureStore from '../store/adventureStore';
import Art from './Art';

const LabRoom = () => {
  const {
    activeVerb,
    selectedItem,
    inventory,
    addToInventory,
    setMessage
  } = useAdventureStore();

  const handleHotspotClick = (hotspot) => {
    switch (hotspot) {
      case 'Time Machine':
        if (activeVerb === 'LOOK') {
          setMessage("It's a complex time machine. Looks like it's missing a core component to function.");
        } else if (activeVerb === 'USE') {
          if (selectedItem === 'flux capacitor') {
            setMessage("You inserted the flux capacitor! The time machine hums to life. ZAP! You travel through time!");
            // Further game logic for winning or scene transition could go here
          } else {
            setMessage("You try to use the time machine, but it lacks power. You need the right component.");
          }
        } else if (activeVerb === 'TAKE') {
          setMessage("It's far too heavy to take with you.");
        } else {
          setMessage("Nothing happens.");
        }
        break;

      case 'Door':
        if (activeVerb === 'LOOK') {
          setMessage("A heavy reinforced steel door. It leads out of the lab.");
        } else if (activeVerb === 'OPEN' || activeVerb === 'USE') {
          setMessage("It's securely locked. You're trapped in the lab for now.");
        } else {
          setMessage("The door doesn't budge.");
        }
        break;

      case 'Chalkboard':
        if (activeVerb === 'LOOK') {
          setMessage("The chalkboard is covered in temporal mechanics equations. A scribbled note reads: 'Don't forget to install the flux capacitor from the desk!'");
        } else if (activeVerb === 'TAKE') {
          setMessage("You can't take the chalkboard, it's bolted to the wall.");
        } else {
          setMessage("You admire the complex math.");
        }
        break;

      case 'Desk':
        if (activeVerb === 'LOOK') {
          setMessage("A messy workstation scattered with tools and blueprints.");
        } else if (activeVerb === 'TAKE') {
          // Assuming inventory is an array of item strings
          if (!inventory || !inventory.includes('flux capacitor')) {
            addToInventory('flux capacitor');
            setMessage("You rummaged through the desk and found a flux capacitor! Added to inventory.");
          } else {
            setMessage("You've already taken everything useful from the desk.");
          }
        } else {
          setMessage("It's just a desk.");
        }
        break;

      default:
        setMessage("Nothing interesting happens.");
    }
  };

  // Styles for the invisible hotspots
  const hotspotStyle = {
    position: 'absolute',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    // border: '1px solid red', // Uncomment for debugging hotspot boundaries
  };

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden' }}>
      {/* Background Art */}
      <Art />

      {/* Time Machine Hotspot */}
      <div
        style={{ ...hotspotStyle, top: '15%', left: '35%', width: '30%', height: '50%' }}
        onClick={() => handleHotspotClick('Time Machine')}
        aria-label="Time Machine"
      />

      {/* Door Hotspot */}
      <div
        style={{ ...hotspotStyle, top: '25%', left: '5%', width: '15%', height: '60%' }}
        onClick={() => handleHotspotClick('Door')}
        aria-label="Door"
      />

      {/* Chalkboard Hotspot */}
      <div
        style={{ ...hotspotStyle, top: '20%', left: '70%', width: '25%', height: '30%' }}
        onClick={() => handleHotspotClick('Chalkboard')}
        aria-label="Chalkboard"
      />

      {/* Desk Hotspot */}
      <div
        style={{ ...hotspotStyle, top: '65%', left: '65%', width: '30%', height: '25%' }}
        onClick={() => handleHotspotClick('Desk')}
        aria-label="Desk"
      />
    </div>
  );
};

export default LabRoom;
