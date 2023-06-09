import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react';
import * as Yup from 'yup'

import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { polygonZkEvm } from '@wagmi/chains';
import fantaCrypto from '../contract/FantaCryptoDemo.json'
const fantaCryptoAbi = fantaCrypto.abi

const MarketFormSchema = Yup.object().shape({
    market_name: Yup.string()
        .min(2, 'Too Short!')
        .max(70, 'Too Long!')
        .required('Required'),
    token_amount: Yup.string()
        .min(1, 'Minimum 1!')
        .required('Required'),
});

export function MarketForm() {
    
    const [marketName, setMarketName] = useState('')
    const [marketNameError, setMarketNameError] = useState('')
    const [tokenAmount, setTokenAmount] = useState('0')
    const [tokenAmountError, setTokenAmountError] = useState('')
    const [roundDeadline, setRoundDeadline] = useState('0')
    const [roundDeadlineError, setRoundDeadlineError] = useState('')
    const [marketDeadline, setMarketDeadline] = useState('0')
    const [marketDeadlineError, setMarketDeadlineError] = useState('')
    const [playerFee, setPlayerFee] = useState('0')
    const [playerFeeError, setPlayerFeeError] = useState('')
    const [publicMarket, setPublicMarket] = useState(false)
    const [enabledCreateMarket, setEnabledCreateMarket] = useState(false)
    
    const { config } = usePrepareContractWrite({
        address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}`,
        abi: fantaCryptoAbi,
        functionName: 'createMarket',
        enabled: enabledCreateMarket,
        args: [
            marketName,
            tokenAmount,
            roundDeadline,
            marketDeadline,
            +playerFee,
            [],
            !publicMarket 
                ?
            [
                '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
                '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            ] 
                :
            []
        ],
    })
    
    const { write } = useContractWrite(config)

    useEffect(() => {
        if (marketName != "" && tokenAmount != "" && roundDeadline != "" && marketDeadline != "" && playerFee != "") {
            setEnabledCreateMarket(true)
        }
    }, [marketName, tokenAmount, roundDeadline, marketDeadline, playerFee])

    return (
        <Formik
            initialValues={{
                market_name: ''
            }}
            // validationSchema={MarketFormSchema}  // this works but I didn't set the error messages :)
            onSubmit={
                () => write?.()
            }
        >
            {(props) => (
                <Form className='forms'>
                    <FormControl className="form-control" isInvalid={marketNameError != ""}>
                        <FormLabel>Market Name</FormLabel>
                        <Input type='text' value={marketName} onChange={(e) => { setMarketName(e.target.value) }} />
                        <FormErrorMessage>{marketNameError}</FormErrorMessage>
                    </FormControl>

                    <FormControl className="form-control" isInvalid={tokenAmountError != ""}>
                        <FormLabel>Token Amount</FormLabel>
                        <Input type='number' value={tokenAmount} onChange={(e) => { setTokenAmount(e.target.value) }} />
                        <FormErrorMessage>{tokenAmountError}</FormErrorMessage>
                    </FormControl>

                    <FormControl className="form-control" isInvalid={roundDeadlineError != ""}>
                        <FormLabel>Round Deadline</FormLabel>
                        <Input type='text' value={roundDeadline} onChange={(e) => { setRoundDeadline(e.target.value) }} />
                        <FormErrorMessage>{roundDeadlineError}</FormErrorMessage>
                    </FormControl>

                    <FormControl className="form-control" isInvalid={marketDeadlineError != ""}>
                        <FormLabel>Market Deadline</FormLabel>
                        <Input type='text' value={marketDeadline} onChange={(e) => { setMarketDeadline(e.target.value) }} />
                        <FormErrorMessage>{marketDeadlineError}</FormErrorMessage>
                    </FormControl>

                    <FormControl className="form-control" isInvalid={playerFeeError != ""}>
                        <FormLabel>Player Fee</FormLabel>
                        <Input type='number' value={playerFee} onChange={(e) => { setPlayerFee(e.target.value) }} />
                        <FormErrorMessage>{playerFee}</FormErrorMessage>
                    </FormControl>

                    <FormControl className="form-control">
                        <Checkbox
                            isChecked={publicMarket}
                            onChange={(e) => setPublicMarket(e.target.checked)}
                        >
                            Public
                        </Checkbox>
                    </FormControl>

                    <Button
                        mt={4}
                        colorScheme='blue'
                        // isLoading={props.isSubmitting}
                        type='submit'
                    >
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    )
}