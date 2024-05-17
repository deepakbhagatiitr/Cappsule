import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

function CapsuleWebDevelopmentTest() {
  const [input, setInput] = useState("");
  const [displayText, setDisplayText] = useState('');
  const [medicineInfo, setMedicineInfo] = useState([]);
  const [cards, setCards] = useState(false);
  const [activeButtonIndexForm, setActiveButtonIndexForm] = useState(0); // Track active button index for each button
  const [activeButtonIndexStrength, setActiveButtonIndexStrength] = useState(0); // Track active button index for each button
  const [activeButtonIndexPackage, setActiveButtonIndexPackage] = useState(0); // Track active button index for each button
  const [filteredMedicine, setFilteredMedicine] = useState([]);
  const [strength, setStrength] = useState(null)
  // const [packaging, setPackaging] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [isSpread, setIsSpread] = useState(false);
  const [strengthObject, setStrengthObject] = useState({})
  const [packageValues, setPackageValues] = useState(null);
  const [packageObject, setPackageObject] = useState({});
  const [available, setAvailable] = useState(false);
  const [price, setPrice] = useState([]);
  const [isOverflowingForm, setIsOverflowingForm] = useState(false);
  const [isOverflowingStrength, setIsOverflowingStrength] = useState(false);
  const [isOverflowingPackage, setIsOverflowingPackage] = useState(false);
  const formRef = useRef(null);
  const strengthRef = useRef(null);
  const packageRef = useRef(null);
  const [name, setName] = useState();
  const [weight, setWeight] = useState();
  const [dose, setDose] = useState();




  const checkFormOverflow = () => {
    const fl = formRef.current;
    if (fl) {
      setIsOverflowingForm(fl.scrollHeight > fl.clientHeight || fl.scrollWidth > fl.clientWidth);
    }
  };

  const checkStrengthOverflow = () => {
    const sl = strengthRef.current;
    if (sl) {
      setIsOverflowingStrength(sl.scrollHeight > sl.clientHeight || sl.scrollWidth > sl.clientWidth);
    }
  };

  const checkPackageOverflow = () => {
    const pl = packageRef.current;
    if (pl) {
      setIsOverflowingPackage(pl.scrollHeight > pl.clientHeight || pl.scrollWidth > pl.clientWidth);
    }
  };


  // let name;
  useEffect(() => {
    axios.get("https://backend.cappsule.co.in/api/v1/new_search?q=paracetamol&pharmacyIds=1,2,3")
      .then((response) => {
        setMedicineInfo(response.data.data.saltSuggestions);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    checkFormOverflow();
    checkStrengthOverflow();
    checkPackageOverflow();


  }, [filteredMedicine]);


  function search(e) {
    setDisplayText(input);
    console.log(e);
    setActiveButtonIndexForm(0)
    setActiveButtonIndexStrength(0)
    setActiveButtonIndexPackage(0)
    setIsFree(false)
    setIsExpanded(false)
    setIsSpread(false)
    e.preventDefault();
    const filtered = medicineInfo.filter(medicine =>
      medicine.salt.toLowerCase().includes(input.toLowerCase())
    );
    if (filtered.length > 0) {
      setFilteredMedicine(filtered);
      setCards(true);

      const keys = (filtered[0].available_forms);
      const keys_mass = Object.keys(filtered[0].salt_forms_json[keys[0]]);
      console.log(keys_mass);
      setWeight(keys_mass[0])
      setStrength(keys_mass)
      setStrengthObject(filtered[0].salt_forms_json[keys[0]])
      const keys_package = Object.keys(filtered[0].salt_forms_json[keys[0]]);
      console.log(keys_package);
      let y = (Object.keys(filtered[0].salt_forms_json[keys[0]][keys_package[0]]));
      console.log(y);
      setDose(y[0])
      setPackageObject(filtered[0].salt_forms_json[keys[0]][keys_package[0]]);
      setPackageValues(Object.keys(filtered[0].salt_forms_json[keys[0]][keys_package[0]]))
      console.log((filtered[0].salt_forms_json[keys[0]][keys_package[0]])[(y[0])]);
      console.log(keys);
      setName(keys[0])
      const valuesArray = Object.values((filtered[0].salt_forms_json[keys[0]][keys_package[0]])[(y[0])]); // Get values of the object at key 'e'
      console.log(valuesArray);

      const isFullyNull = valuesArray.every(x => x === null);
      setAvailable(isFullyNull);

      if (isFullyNull) {
        console.log("The array is fully null.");
        setPrice(
          [[{
            "pharmacy_id": 3,
            "selling_price": (<div className="message-box">
              No stores selling this product near you
            </div>)
          }]])
      }
      else {

        let x = []
        valuesArray.forEach(value => {
          if (value !== null) {
            x.push(value);
          }
        });
        console.log(x);
        setPrice(x)
      }
    } else {
      alert("No Medicine Found");
    }

  }



  const handleFormClick = (index, e) => {
    console.log(index);
    checkStrengthOverflow()
    // checkPackageOverflow()
    setIsExpanded(false)
    setIsSpread(false)
    setName(e)
    setActiveButtonIndexForm(index);
    setActiveButtonIndexStrength(0) // Set active button index when clicked
    console.log(filteredMedicine);

    setStrengthObject(filteredMedicine[0].salt_forms_json[e]);
    console.log(filteredMedicine[0].salt_forms_json[e]);
    const strength_keys = Object.keys(filteredMedicine[0].salt_forms_json[e]);
    setStrength(strength_keys);
    const object = strength_keys[0];
    console.log(object);

    const x = filteredMedicine[0].salt_forms_json[e];
    console.log(x);

    if (x.hasOwnProperty(object)) {
      const package_keys = Object.keys(x[object]);
      console.log(package_keys);
      setPackageValues(package_keys)
      // setPackaging(package_keys);
    } else {
      console.log("Property does not exist in the object.");
    }

  };

  const handleStrengthClick = (position, e) => {
    setActiveButtonIndexStrength(position); // Set active button index when clicked
    setActiveButtonIndexPackage(0)
    setWeight(e)
    // console.log(packageValues);
    // checkOverflow()
    // setIsExpanded(false)
    setIsSpread(false)

    checkPackageOverflow();

    console.log(e);

    console.log(strengthObject);
    const packaging_keys = Object.keys(strengthObject);

    console.log(packaging_keys);
    const index = packaging_keys.indexOf(e);
    if (index !== -1) {
      console.log(index);
    } else {
      console.log("no data found");
    }

    const valuesArray = Object.values(strengthObject);
    setPackageObject(valuesArray[index]);
    console.log(valuesArray);


    console.log(e);
    const package_values = Object.keys(valuesArray[index]);
    setPackageValues(Object.keys(valuesArray[index]));
    console.log(package_values[0]);
    setDose(package_values[0])
    console.log();
    console.log(strengthObject[e]);
    const Array = Object.values(strengthObject[e]); // Get values of the object at key 'e'
    console.log(Array[0]);
    const values = Object.values(Array[0]);
    console.log(values);
    setPrice(values)


    const isFullyNull = values.every(x => x === null); // Check if all values are null
    setAvailable(isFullyNull); // Set availability state

    if (isFullyNull) {
      console.log("The array is fully null.");
      setPrice(
        [[{
          "pharmacy_id": 3,
          "selling_price": (<div className="message-box">
            No stores selling this product near you
          </div>)
        }]])
    }
    else {

      let x = []
      values.forEach(val => {
        if (val !== null) {
          x.push(val); // Push non-null values to the price array
        }
      });
      console.log(x);
      setPrice(x)
    }




  };
  const handlePackagingClick = (position, e) => {
    setDose(e)
    setActiveButtonIndexPackage(position);
    console.log(e); // Log the event
    console.log(packageObject);
    // Ensure packageObject is defined and has the key 'e'
    if (packageObject && packageObject.hasOwnProperty(e)) {
      console.log(packageObject[e]); // Log the packageObject at key 'e'

      const valuesArray = Object.values(packageObject[e]); // Get values of the object at key 'e'
      console.log(valuesArray);

      const isFullyNull = valuesArray.every(x => x === null); // Check if all values are null
      setAvailable(isFullyNull); // Set availability state

      if (isFullyNull) {
        console.log("The array is fully null.");
        setPrice(
          [[{
            "pharmacy_id": 3,
            "selling_price": (<div className="message-box">
              No stores selling this product near you
            </div>)
          }]])
      }
      else {

        let x = []
        valuesArray.forEach(value => {
          if (value !== null) {
            x.push(value); // Push non-null values to the price array
          }
        });
        console.log(x);
        setPrice(x)
      }
    }
  };
  const capitalizeFirstLetter = string => {
    if (!string) return string; // Check if the string is empty or undefined
    return string.charAt(0).toUpperCase() + string.slice(1);
  };



  return (
    <>
      <header>
        <p>Cappsule web development</p>
      </header>
      <main>
        <div className="search_container">
          <form onSubmit={search}>
            <div className="search-box">
              <FontAwesomeIcon onClick={search} className="magnifying-glass-icon" icon={faMagnifyingGlass} />
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your medicine name here" />
              <button type="submit">Search</button>
            </div>
          </form>
          <hr />
        </div>
        {cards ? (
          <main className="medicine_container">
            {price.map((value, index) => (
              value.map((x, index) => (
                <div className="medicine" key={index}>
                  <div className="medicine_info">
                    <div className="form">
                      <p>Form :</p>
                      <div ref={formRef} className={isFree ? 'info-form form-expanded' : 'info-form'}>
                        {filteredMedicine &&
                          filteredMedicine[0].available_forms.map((e, index) => (
                            <button
                              onClick={() => handleFormClick(index, e)}
                              key={index}
                              className={`glow-button form_button ${activeButtonIndexForm === index ? 'active' : ''}`}
                            >
                              {(e)}
                            </button>
                          ))}
                      </div>
                      {isOverflowingForm && (<div className="show-more" onClick={() => { setIsFree(!isFree) }}>
                        {isFree ? 'hide..' : 'more..'}
                      </div>)
                      }
                    </div>

                    <div className="strength">
                      <p className="strength_para">Strength :</p>
                      <div ref={strengthRef} className={isExpanded ? 'info-strength strength-expanded' : "info-strength"}>
                        {strength && // Check if strength is not null or undefined
                          strength.map((e, index) => (
                            <button
                              onClick={() => handleStrengthClick(index, e)}
                              key={index}
                              className={`glow-button strength_button ${activeButtonIndexStrength === index ? 'active' : ''}`}
                            >
                              {e}
                            </button>
                          ))}
                      </div>
                      {isOverflowingStrength && (
                        <div className="show-more" onClick={() => { setIsExpanded(!isExpanded) }}>
                          {isExpanded ? 'hide..' : 'more..'}
                        </div>
                      )}
                    </div>
                    <div className="packaging">
                      <p>Packaging :</p>
                      <div ref={packageRef} className={isSpread ? 'info-packaging package-expanded' : 'info-packaging'}>
                        {/* <div className="info"> */}
                        {packageValues && // Check if strength is not null or undefined
                          packageValues.map((e, index) => (

                            <button
                              onClick={() => handlePackagingClick(index, e)}
                              key={index}
                              className={`glow-button package-button ${activeButtonIndexPackage === index ? 'active' : ''}`}
                            >
                              {(e)}
                            </button>
                          ))}
                      </div>
                      {isOverflowingPackage && (<div className="show-more" onClick={() => { setIsSpread(!isSpread) }}>
                        {isSpread ? 'hide..' : 'more..'}
                      </div>)
                      }


                    </div>
                  </div>
                  <div className="medicine-details">
                    <h4>{capitalizeFirstLetter(displayText)}</h4>
                    <div className="medicine-item">
                      <p>{name} | {weight} | {dose}</p>
                    </div>
                  </div>
                  <div className="price">
                    {available ?
                      <div className="message-box">
                        No stores selling this product near you
                      </div>
                      :
                      (

                        <h2 key={index}>From ₹ {x["selling_price"]}</h2>
                      )
                    }
                  </div>

                </div>
              ))
            ))}
          </main>
        ) : (
          <div className="content">

            <q> Find medicines with amazing discounts </q>
          </div>
        )}
      </main>
    </>
  );
}

export default CapsuleWebDevelopmentTest;