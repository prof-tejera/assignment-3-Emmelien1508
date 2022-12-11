import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router"
import qs from "qs"

export const useQueryState = query => {
    const location = useLocation()
    const navigate = useNavigate()

    const setQuery = useCallback(value => {
        const existingQueries = qs.parse(location.search, {
            ignoreQueryPrefix: true,
        })

        const queryString = qs.stringify(
            { ...existingQueries, [query]: value },
            { skipNulls: true }
        )

        navigate(`${location.pathname}?${queryString}`)
    }, [navigate, location, query])

    return [
        qs.parse(location.search, { ignoreQueryPrefix: true })[query],
        setQuery,
    ]
}


// const [chosenType, setChosenType] = useQueryState("type")
// const [chosenRounds, setChosenRounds] = useQueryState("rounds")
// const [chosenMinutes, setChosenMinutes] = useQueryState("minutes")
// const [chosenSeconds, setChosenSeconds] = useQueryState("seconds")
// const [chosenRestMinutes, setChosenRestMinutes] = useQueryState("restminutes")
// const [chosenRestSeconds, setChosenRestSeconds] = useQueryState("restseconds")