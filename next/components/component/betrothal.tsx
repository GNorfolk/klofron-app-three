import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { Button } from "../ui/button"
import { HeaderTwo } from "../ui/header"
import { DivIconInfo } from '../ui/div'
import { Paragraph, Small } from '../ui/text'
import { StyledSelect } from "../ui/input"
import Link from 'next/link'
import { StyledLink } from "../ui/link"

export function BetrothalInfo({ personInfo }) {
  return (
    <main>
      <HeaderTwo>Betrothal Info</HeaderTwo>
      <StyledLink href={"/person/" + personInfo.person_id + "/betrothal"}>
        <div className="flex">
          <DivIconInfo iconType="ChurchIcon">{personInfo.person_name + " has " + personInfo.person_betrothal_receipts.length + " betrothals."}</DivIconInfo>
        </div>
      </StyledLink>
    </main>
  )
}

export function BetrothalListing({ familyPeople, accepterId = null }) {
  const familyPeopleBetrothals = familyPeople.filter(ppl => ppl.person_betrothal_receipts.length > 0)
  return (
    <main>
      <HeaderTwo>Betrothal Info</HeaderTwo>
      { familyPeopleBetrothals.length > 0 ? familyPeopleBetrothals.map(({ person_id, person_name, person_betrothal_receipts }) => (
        <StyledLink href={"/person/" + person_id + "/betrothal"}>
          <div className="flex">
            <DivIconInfo iconType="ChurchIcon">{person_name + " has " + person_betrothal_receipts.length + " betrothals."}</DivIconInfo>
          </div>
        </StyledLink>
      )) :
      <Paragraph>No family members have betrothals!</Paragraph>
      }
    </main>
  )
}

export function BetrothalEligibleListing({ familyPeople, accepterId = null }) {
  const familyPeopleBachelors = familyPeople.filter(ppl => ppl.person_age >= 18 && ppl.person_partner_id === null)
  return (
    <main>
      <HeaderTwo>Betrothal Eligible Info</HeaderTwo>
      { familyPeopleBachelors.length > 0 ? familyPeopleBachelors.map(({ person_id, person_name, person_betrothal_receipts }) => (
        <StyledLink href={"/person/" + person_id + "/betrothal"}>
          <div className="flex">
            <DivIconInfo iconType="ChurchIcon">{person_name + " is eligible for betrothal."}</DivIconInfo>
          </div>
        </StyledLink>
      )) :
      <Paragraph>No family members are eligible for betrothal!</Paragraph>
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
      <HeaderTwo>Betrothal Eligible Info</HeaderTwo>
      { bachelors.length > 0 ? bachelors.map(({ person_id, person_name, person_family, person_gender, person_age }) => (
        <StyledLink href={person_id.toString()}>
          <div className="flex">
            <DivIconInfo iconType="ChurchIcon">{person_name + " " + person_family.family_name + " is " + person_gender + " and " + person_age + " years old."}</DivIconInfo>
          </div>
        </StyledLink>
      )) :
      <Paragraph>Nobody is eligible for betrothal!</Paragraph>
      }
    </main>
  )
}

export function BetrothalCreation({ peopleData, familyId, personId, queryClient, familyName }) {
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
      <HeaderTwo>Betrothal Creation</HeaderTwo>
      {
        familyBachelors.length > 0 ?
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <StyledSelect fieldName="betrothal_proposer_person_id" fieldRequired={true}>
                  {
                    errors.betrothal_proposer_person_id ? document.getElementById("cm-" + personId).innerText = "The Person field is required" : null
                  }
                  <option selected={true} disabled={true}>Select a betrothal proposer person</option>
                  {
                    familyBachelors.map(({ person_id, person_name }) => (
                      <option value={person_id}>{person_name} {familyName}</option>
                    ))
                  }
                </StyledSelect>
                <StyledSelect fieldName="betrothal_dowry_person_id" fieldRequired={true}>
                  {
                    errors.betrothal_dowry_person_id ? document.getElementById("cm-" + personId).innerText = "The Person field is required" : null
                  }
                  <option selected={true} disabled={true}>Select a betrothal dowry person</option>
                  {
                    familyBachelors.map(({ person_id, person_name }) => (
                      <option value={person_id}>{person_name} {familyName}</option>
                    ))
                  }
                </StyledSelect>
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
            <Small uid={personId}></Small>
          </div>
        :
          <Paragraph>No family people are eligible to betrothe!</Paragraph>
      }
    </main>
  )
}

export function BetrothalReciepts({ receipts }) {
  return (
    <main>
      <HeaderTwo>Betrothal Receipt Info</HeaderTwo>
      { receipts.length > 0 ? receipts.map(({ betrothal_proposer_person, betrothal_dowry }) => (
        <StyledLink href="#">
          <div className="flex">
            <DivIconInfo iconType="ChurchIcon">{betrothal_proposer_person.person_name + " " + betrothal_proposer_person.person_family.family_name + " & " + betrothal_dowry.betrothal_dowry_person.person_name + " " + betrothal_dowry.betrothal_dowry_person.person_family.family_name + "."}</DivIconInfo>
          </div>
        </StyledLink>
      )) :
      <Paragraph>This person has received no betrothals!</Paragraph>
      }
    </main>
  )
}

export function BetrothalRecieptResponse({ data, queryClient }) {
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
    if (isNaN(formData.betrothal_id)) {
      document.getElementById("cm-" + data.person_id).innerText = "Invalid betrothal ID"
      throw "Invalid betrothal ID"
    }
    axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/betrothal/' + formData.betrothal_id, {
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
      <HeaderTwo>Betrothal Response</HeaderTwo>
      {
        data.person_betrothal_receipts.length > 0 && familyBachelors.length > 0 ?
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <StyledSelect fieldName="betrothal_id" fieldRequired={true}>
                  {
                    errors.betrothal_id ? document.getElementById("cm-" + data.person_id).innerText = "The Person field is required" : null
                  }
                  <option selected disabled>Select a betrothal proposer / dowry person combo</option>
                  {
                    data.person_betrothal_receipts.map(({ betrothal_id, betrothal_proposer_person, betrothal_dowry }) => (
                      <option value={betrothal_id}>{betrothal_proposer_person.person_name} {betrothal_proposer_person.person_family.family_name} / {betrothal_dowry.betrothal_dowry_person.person_name} {betrothal_dowry.betrothal_dowry_person.person_family.family_name}</option>
                    ))
                  }
                </StyledSelect>
                <StyledSelect fieldName="accepter_person_id" fieldRequired={true}>
                  {
                    errors.accepter_person_id ? document.getElementById("cm-" + data.person_id).innerText = "The Person field is required" : null
                  }
                  <option selected disabled>Select a betrothal acceptor person</option>
                  {
                    familyBachelors.map(({ person_id, person_name }) => (
                      <option value={person_id}>{person_name} {data.person_family.family_name}</option>
                    ))
                  }
                </StyledSelect>
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
            <Small uid={data.person_id}></Small>
          </div>
        :
          <Paragraph>No betrothals or no family people are eligible to betrothe!</Paragraph>
      }
    </main>
  )
}