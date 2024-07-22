import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { ChurchIcon } from '../ui/icon'

export function BetrothalInfo({ personInfo }) {
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Info</h2>
        <a href={"/person/" + personInfo.person_id + "/betrothal"} className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 min-w-5 min-h-5 mx-2" />
              <span className='whitespace-nowrap'>{personInfo.person_name} has {personInfo.person_betrothal_receipts.length} betrothals.</span>
            </div>
          </div>
        </a>
    </main>
  )
}

export function BetrothalListing({ familyPeople, accepterId = null }) {
  const familyPeopleBetrothals = familyPeople.filter(ppl => ppl.person_betrothal_receipts.length > 0)
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Info</h2>
      { familyPeopleBetrothals.length > 0 ? familyPeopleBetrothals.map(({ person_id, person_name, person_betrothal_receipts }) => (
        <a href={"/person/" + person_id + "/betrothal"} className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 min-w-5 min-h-5 mx-2" />
              <span className='whitespace-nowrap'>{person_name} has {person_betrothal_receipts.length} betrothals.</span>
            </div>
          </div>
        </a>
      )) :
      <p className="m-2 text-gray-500 dark:text-gray-400">No family members have betrothals!</p>
      }
    </main>
  )
}

export function BetrothalEligibleListing({ familyPeople, accepterId = null }) {
  const familyPeopleBachelors = familyPeople.filter(ppl => ppl.person_age >= 18 && ppl.person_partner_id === null)
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Eligible Info</h2>
      { familyPeopleBachelors.length > 0 ? familyPeopleBachelors.map(({ person_id, person_name, person_betrothal_receipts }) => (
        <a href={"/person/" + person_id + "/betrothal"} className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 min-w-5 min-h-5 mx-2" />
              <span className='whitespace-nowrap'>{person_name} is eligible for betrothal.</span>
            </div>
          </div>
        </a>
      )) :
      <p className="m-2 text-gray-500 dark:text-gray-400">No family members are eligible for betrothal!</p>
      }
    </main>
  )
}

export function BetrothalCreationListing({ peopleData, familyId }) {
  const bachelors = peopleData.filter(
    ppl => ppl.person_age >= 18 && ppl.person_partner_id == null && ppl.person_family_id != familyId
  )
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Eligible Info</h2>
      { bachelors.length > 0 ? bachelors.map(({ person_id, person_name, person_family, person_gender, person_age }) => (
        <a href={person_id} className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 min-w-5 min-h-5 mx-2" />
              <span className='whitespace-nowrap'>{person_name} {person_family.family_name} is {person_gender} and {person_age} years old.</span>
            </div>
          </div>
        </a>
      )) :
      <p className="m-2 text-gray-500 dark:text-gray-400">Nobody is eligible for betrothal!</p>
      }
    </main>
  )
}

export function BetrothalCreation({ peopleData, familyId, personId, queryClient }) {
  const familyBachelors = peopleData.filter(ppl =>
    ppl.person_age >= 18 && ppl.person_partner_id === null && ppl.person_id != personId
  )

  type Inputs = {
    betrothal_recipient_person_id: number
    betrothal_proposer_person_id: number
    betrothal_dowry_person_id: number
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/betrothal', {
      betrothal_recipient_person_id: personId,
      betrothal_proposer_person_id: formData.betrothal_proposer_person_id,
      betrothal_dowry_person_id: formData.betrothal_dowry_person_id
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + personId).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + personId).innerText = error.response.data.message
    })
  }

  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Creation</h2>
      {
        familyBachelors.length > 0 ?
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <select {...register("betrothal_proposer_person_id", { required: true })}>
              {
                errors.betrothal_proposer_person_id ? document.getElementById("cm-" + personId).innerText = "The Person field is required" : null
              }
              {
                familyBachelors.map(({ person_id, person_name }) => (
                  <option value={person_id}>{person_name}</option>
                ))
              }
              </select>
              <select {...register("betrothal_dowry_person_id", { required: true })}>
              {
                errors.betrothal_dowry_person_id ? document.getElementById("cm-" + personId).innerText = "The Person field is required" : null
              }
              {
                familyBachelors.map(({ person_id, person_name }) => (
                  <option value={person_id}>{person_name}</option>
                ))
              }
              </select>
              <input type="submit" />
            </form>
            <small className="text-stone-500" id={'cm-' + personId}></small>
          </div>
        :
          <p className="m-2 text-gray-500 dark:text-gray-400">No family people are eligible to betrothe!</p>
      }
    </main>
  )
}

export function BetrothalReciepts({ receipts }) {
  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Receipt Info</h2>
      { receipts.length > 0 ? receipts.map(({ betrothal_proposer_person, betrothal_dowry }) => (
        <a href="#" className="p-6 pt-2 pb-2">
          <div className="flex">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ChurchIcon className="w-5 h-5 min-w-5 min-h-5 mx-2" />
              <span className='whitespace-nowrap'>{betrothal_proposer_person.person_name} {betrothal_proposer_person.person_family.family_name} & {betrothal_dowry.betrothal_dowry_person.person_name} {betrothal_dowry.betrothal_dowry_person.person_family.family_name}.</span>
            </div>
          </div>
        </a>
      )) :
      <p className="m-2 text-gray-500 dark:text-gray-400">This person has received no betrothals!</p>
      }
    </main>
  )
}

export function BetrothalRecieptResponse({ data, queryClient = null }) {
  const familyBachelors = data.person_family.family_people.filter(ppl =>
    ppl.person_age >= 18 && ppl.person_partner_id === null && ppl.person_id != data.person_id
  )

  type Inputs = {
    betrothal_id: number
    accepter_person_id: number
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/betrothal/' + formData.betrothal_id, {
      accepter_person_id: formData.accepter_person_id
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + data.person_id).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + data.person_id).innerText = error.response.data.message
    })
  }

  return (
    <main>
      <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Response</h2>
      {
        data.person_betrothal_receipts.length > 0 && familyBachelors.length > 0 ?
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <select {...register("betrothal_id", { required: true })}>
              {
                errors.betrothal_id ? document.getElementById("cm-" + data.person_id).innerText = "The Person field is required" : null
              }
              {
                data.person_betrothal_receipts.map(({ betrothal_id, betrothal_proposer_person, betrothal_dowry }) => (
                  <option value={betrothal_id}>{betrothal_proposer_person.person_name} {betrothal_proposer_person.person_family.family_name} / {betrothal_dowry.betrothal_dowry_person.person_name} {betrothal_dowry.betrothal_dowry_person.person_family.family_name}</option>
                ))
              }
              </select>
              <select {...register("accepter_person_id", { required: true })}>
              {
                errors.accepter_person_id ? document.getElementById("cm-" + data.person_id).innerText = "The Person field is required" : null
              }
              {
                familyBachelors.map(({ person_id, person_name }) => (
                  <option value={person_id}>{person_name} {data.person_family.family_name}</option>
                ))
              }
              </select>
              <input type="submit" />
            </form>
            <small className="text-stone-500" id={'cm-' + data.person_id}></small>
          </div>
        :
          <p className="m-2 text-gray-500 dark:text-gray-400">No betrothals or no family people are eligible to betrothe!</p>
      }
    </main>
  )
}