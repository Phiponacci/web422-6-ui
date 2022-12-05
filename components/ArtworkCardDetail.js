import { Button, Card } from 'react-bootstrap'
import { addToFavourites, removeFromFavourites } from '../lib/userData'
import { useEffect, useState } from 'react'

import Error from 'next/error'
import { favouritesAtom } from '../store'
import { useAtom } from 'jotai'
import useSWR from 'swr'

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null,
  )

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)
  // default is: favouritesList.includes(objectID)
  const [showAdded, setShowAdded] = useState(false)

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID))
  }, [favouritesList])

  async function favouritesClicked() {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(objectID))
      console.log(favouritesList)
    } else {
      setFavouritesList(await addToFavourites(objectID))
    }
  }

  if (error) {
    return <Error statusCode={404} />
  }

  if (data) {
    return (
      <>
        <Card>
          {data.primaryImage && (
            <Card.Img variant="top" src={data.primaryImage} />
          )}
          <Card.Body>
            <Card.Title>{data.title || 'N/A'}</Card.Title>
            <Card.Text>
              <strong>Date: </strong>
              {data.objectDate || 'N/A'}
              <br />
              <strong>Classification: </strong>
              {data.classification || 'N/A'}
              <br />
              <strong>Medium: </strong>
              {data.medium || 'N/A'}
              <br />
              <br />
              <strong>Artist: </strong> {data.artistDisplayName || 'N/A'}{' '}
              {data.artistWikidata_URL && (
                <>
                  ({' '}
                  <a
                    href={data.artistWikidata_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    wiki
                  </a>{' '}
                  )
                </>
              )}
              <br />
              <strong>Credit Line: </strong> {data.creditLine || 'N/A'}
              <br />
              <strong>Dimensions: </strong> {data.dimensions || 'N/A'}
              <br />
              <br />
              <Button
                variant={showAdded ? 'primary' : 'outline-primary'}
                onClick={favouritesClicked}
              >
                + Favourite {showAdded && '( added )'}
              </Button>
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    )
  } else {
    return null
  }
}
