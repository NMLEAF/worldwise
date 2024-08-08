// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCities } from '../contexts/CitiesContext';
import { useUrlPosition } from '../hooks/useUrlPosition';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './Form.module.css';
import Button from './Button';
import ButtonBack from './ButtonBack';
import Spinner from './Spinner';
import Message from './Message';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('');

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState('');

  // ADDING CITY IN THE STATE
  // const handleAddCity = e => {
  //   e.preventDefault();

  //   const newCity = {
  //     cityName,
  //     country: 'Ethiopia',
  //     emoji: '🇵🇹',
  //     date: '2027-10-31T15:59:59.138Z',
  //     notes,
  //     position: {
  //       lat,
  //       lng,
  //     },
  //     id: 739308685,
  //   };

  //   onAddCity(newCity);
  //   navigate('/app/cities');

  //   // CLEAR INPUTS
  //   // setNotes('');
  //   // setCityName('');
  // };

  const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

  useEffect(
    function () {
      if (!lat && !lng) return;

      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError('');

          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          if (!data.countryCode)
            throw new Error(
              `That doesn't seem to be a city, Click somewhere else 😉`
            );

          setCityName(data.city || data.locality || '');
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      notes,
      date,
      position: {
        lat,
        lng,
      },
    };

    await createCity(newCity);
    navigate('/app/cities');
  }

  if (isLoadingGeocoding) return <Spinner />;
  if (geocodingError) return <Message message={geocodingError} />;
  if (!lat && !lng)
    return <Message message={'Start by clicking somewhere on the map'} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      // onSubmit={handleAddCity}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={e => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input id="date" onChange={e => setDate(e.target.value)} value={date} /> */}
        <DatePicker
          id="date"
          onChange={date => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={'primary'}>Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
